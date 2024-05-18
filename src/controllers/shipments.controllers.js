import axios from "axios";
import fs from "fs";
import http from "http";
import csvParser from 'csv-parser';
import { ApiResponse } from "../utils/ApiResponse.js";
import { tryCatch } from "../utils/tryCatch.js";
import { DispatchedShipment, ReturnItems, Shipment, ShippedItems } from "../models/shipment.model.js";
import { notFound } from "../utils/notFound.js";
import { InventoryItem } from "../models/inventory.model.js";
import { validateRequiredFields } from "../utils/validations.js";



// ORDER PULLER ROLE !
export const getAllShipments = tryCatch(async (req, res) => {
    const ShipmentData = await Shipment.find();

    if (!ShipmentData) {
        return res.status(404).json({ status: 404, success: false, message: "No Shipment data found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", ShipmentData)
    )
});

export const assignIMEI = tryCatch(async (req, res) => {
    const { IMEI, trackingNumber } = req.body

    const InventoryIMEI = await InventoryItem.findOne({ 'items.IMEI': IMEI });

    if (!InventoryIMEI) {
        return res.status(404).json({ status: 404, success: false, message: "Provided IMEI doesn't exist in inventory!" })
    }

    const item = InventoryIMEI.items.filter(item => item.IMEI == IMEI);

    if (item[0].Status !== "Available" && item[0].Status !== "Problem") {
        return res.status(404).json({ status: 404, success: false, message: `IMEI not available in the inventory , current status is ${item[0].Status}` })
    }
    // Update the status to 'In progress'
    const updatedItem = await InventoryItem.findOneAndUpdate(
        { 'items.IMEI': IMEI },
        { $set: { 'items.$.Status': 'In progress' } },
        { new: true } // Return the updated document
    );

    if (!updatedItem) {
        return res.status(404).json({ status: 404, success: false, message: "No IMEI found in inventory database" })
    }

    const ShipmentData = await Shipment.findOne({ trackingNumber });

    if (!ShipmentData) {
        return res.status(404).json({ status: 404, success: false, message: "No Shipment data found" })
    }
    if (ShipmentData.remainingItems === 0) {
        return res.status(404).json({ status: 404, success: false, message: "Cannot Assign More IMEI, Quantity if full!" })
    }

    ShipmentData.IMEI.push(IMEI);
    ShipmentData.remainingItems = ShipmentData.remainingItems - 1;

    await ShipmentData.save();

    let dispatchedShipmentData = await DispatchedShipment.findOne({ trackingNumber });

    if (dispatchedShipmentData) {
        // Document already exists, so just push the new IMEI into the existing document

        dispatchedShipmentData.IMEI.push(IMEI);
        dispatchedShipmentData.remainingItems = dispatchedShipmentData.IMEI.length;

        await dispatchedShipmentData.save();
    } else {
        // Document does not exist, so create a new DispatchedShipment document
        dispatchedShipmentData = await DispatchedShipment.create({
            orderID: ShipmentData.orderID,
            orderNumber: ShipmentData.orderNumber,
            orderDate: ShipmentData.orderDate,
            trackingNumber: ShipmentData.trackingNumber,
            SKU: ShipmentData.SKU,
            quantity: ShipmentData.quantity,
            remainingItems: 1,
            serialNumbers: ShipmentData.serialNumbers,
            IMEI: [IMEI],
        });
    }

    return res.status(200).json(
        new ApiResponse(200, `Assigned Successfully To TrackingNum : ${trackingNumber}`, ShipmentData)
    )
});

export const returnItemIMEI = tryCatch(async (req, res) => {
    const { currentIMEI, newIMEI, trackingNumber } = req.body

    const currentIMEIInventory = await InventoryItem.findOne({ 'items.IMEI': currentIMEI });

    if (!currentIMEIInventory) {
        return res.status(404).json({ status: 404, success: false, message: "Current IMEI doesn't exist in inventory!" })
    }

    const newIMEIInventory = await InventoryItem.findOne({ 'items.IMEI': newIMEI });

    if (!newIMEIInventory) {
        return res.status(404).json({ status: 404, success: false, message: "New IMEI doesn't exist in inventory!" })
    }
    const ShipmentData = await Shipment.findOne({ trackingNumber });

    if (!ShipmentData) {
        return res.status(404).json({ status: 404, success: false, message: "No Shipment data found" })
    }

    const currentIMEIItem = currentIMEIInventory.items.filter(item => item.IMEI == currentIMEI);

    if (currentIMEIItem[0].Status !== "In progress") {
        return res.status(404).json({ status: 404, success: false, message: `Current IMEI is not in progress, current status is ${currentIMEIItem[0].Status}` })
    }

    // Update the status of current IMEI to 'Problem'
    await InventoryItem.findOneAndUpdate(
        { 'items.IMEI': currentIMEI },
        { $set: { 'items.$.Status': 'Problem' } }
    );


    // Update the status of new IMEI to 'In progress'
    const updatedItem = await InventoryItem.findOneAndUpdate(
        { 'items.IMEI': newIMEI },
        { $set: { 'items.$.Status': 'In progress' } },
        { new: true } // Return the updated document
    );

    if (!updatedItem) {
        return res.status(404).json({ status: 404, success: false, message: "New IMEI not updated to in progress in inventory" })
    }

    //updating the IMEI Item Array
    const currentIndex = ShipmentData.IMEI.findIndex(imei => imei == currentIMEI);
    ShipmentData.IMEI[currentIndex] = newIMEI;
    await ShipmentData.save();

    let dispatchedShipmentData = await DispatchedShipment.findOne({ trackingNumber });

    // Document already exists, so just push the new IMEI array / NEW items, into the dispatch ITEMS
    dispatchedShipmentData.IMEI = ShipmentData.IMEI;
    dispatchedShipmentData.remainingItems = dispatchedShipmentData.IMEI.length;
    await dispatchedShipmentData.save();

    return res.status(200).json(
        new ApiResponse(200, `Item Changed Successfully`, { ShipmentData, currentIndex })
    )
});

export const uploadShipment = tryCatch(async (req, res) => {
    if (!req.file || req.file?.filename === null || req.file?.filename === 'undefined') {
        return res.status(400).json(new ApiResponse(400, "No file uploaded"));
    }

    try {
        const results = [];

        // Read the CSV file
        fs.createReadStream(`./uploads/${req.file?.originalname}`)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // Extracting Shipment data
                const serialNumbersMap = new Map(); // Map to track serial numbers for each source
                const items = results.map((row, index) => {
                    let sourceCode = '';
                    switch (row.Source) {
                        case 'amazon':
                            sourceCode = 'A';
                            break;
                        case 'backmarket':
                            sourceCode = 'B';
                            break;
                        default:
                            sourceCode = '';
                            break;
                    }

                    // Initialize serial number for the source if not already set
                    if (!serialNumbersMap.has(row.Source)) {
                        serialNumbersMap.set(row.Source, 1);
                    }

                    // Generate serial numbers based on quantity
                    const serialNumber = serialNumbersMap.get(row.Source);
                    const serialNumbers = row['Item Quantity'] > 1 ? Array.from({ length: row['Item Quantity'] }, (_, i) => `${sourceCode}${serialNumber}-${i + 1}`) : [`${sourceCode}${serialNumber}`];
                    serialNumbersMap.set(row.Source, serialNumber + 1); // Increment serial number for next item

                    return {
                        orderID: row['Shipment #'],
                        SKU: row['Item SKU'],
                        trackingNumber: row['Tracking #'],
                        orderDate: row['Ship Date'],
                        quantity: row['Item Quantity'],
                        source: row.Source,
                        serialNumbers: serialNumbers // Use the array directly
                    };
                });

                // Check if Shipment model is not found
                notFound(Shipment, res);

                // Save new items to the database
                await Shipment.insertMany(items);

                return res.status(201).json(new ApiResponse(201, `Upload File Successfully (${req.file?.originalname})`));
            });
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, "Error Uploading file"));
    }
});


// EXTRA CONTROLLER FOR FETCHING
export const getAllShipmentsCOMMENT = tryCatch(async (req, res) => {
    const shipStationShipmentsEndpoint = 'https://ssapi.shipstation.com/shipments?sortBy=shipDate&sortOrder=desc&pageSize=500';
    const shipStationOrdersEndpoint = 'https://ssapi.shipstation.com/orders?orderStatus=shipped&orderDate=2023-02-27&pageSize=500';

    // Fetch shipments
    const shipmentsResponse = await axios.get(shipStationShipmentsEndpoint, {
        auth: {
            username: process.env.SHIPSTATION_API_KEY,
            password: process.env.SHIPSTATION_API_SECRET,
        },
    });
    // Fetch orders
    const ordersResponse = await axios.get(shipStationOrdersEndpoint, {
        auth: {
            username: process.env.SHIPSTATION_API_KEY,
            password: process.env.SHIPSTATION_API_SECRET,
        },
    });

    const shipments = shipmentsResponse.data.shipments;
    const orders = ordersResponse.data.orders;

    // Merge shipments and orders based on order ID
    const mergedData = shipments.map(shipment => {
        const order = orders.find(order => order.orderKey === shipment.orderKey);
        console.log("==============>", order?.advancedOptions?.source);
        return {
            shipmentId: shipment.shipmentId,
            orderId: shipment.orderId,
            orderKey: shipment.orderKey,
            userId: shipment.userId,
            customerEmail: shipment.customerEmail,
            orderNumber: shipment.orderNumber,
            createDate: shipment.createDate,
            shipDate: shipment.shipDate,
            sku: order?.items[0]?.sku,
            source: order?.advancedOptions?.source,
        };
    });

    notFound(mergedData, res);

    return res.status(201).json(
        new ApiResponse(201, "Shipments and orders merged successfully!", mergedData)
    );
});



// DISPATCHER ROLE !
export const getAllDispatchedShipments = tryCatch(async (req, res) => {
    const shipments = await DispatchedShipment.find();

    if (!shipments) {
        return res.status(404).json({ status: 404, success: false, message: "No Shipment data found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", shipments)
    )
});

export const dispatchTrackingNumber = tryCatch(async (req, res) => {
    const { trackingNumber } = req.params;

    validateRequiredFields([trackingNumber], res)

    const ShipmentData = await DispatchedShipment.findOne({ trackingNumber });

    if (!ShipmentData) {
        return res.status(404).json({ status: 404, success: false, message: "No tracking number found in database" })
    }
    return res.status(200).json(
        new ApiResponse(200, "Tracking Number Found Successfully!", ShipmentData.IMEI)
    )
});

export const dispatchShipment = tryCatch(async (req, res) => {
    const { trackingNumber } = req.params;
    let { IMEI } = req.body;

    validateRequiredFields([trackingNumber], res)

    const ShipmentData = await DispatchedShipment.findOne({ trackingNumber });

    if (!ShipmentData) {
        return res.status(404).json({ status: 404, success: false, message: "No tracking number found in database" })
    }

    if (!Array.isArray(IMEI)) {
        IMEI = [IMEI]; // Convert to array if it's not already
    }

    if (ShipmentData.remainingItems > 1) {
        await DispatchedShipment.updateOne(
            { trackingNumber },
            { $pull: { IMEI: { $in: IMEI } }, $inc: { remainingItems: -IMEI.length } }
        );
    } else {
        // Delete the whole document
        await DispatchedShipment.deleteOne({ trackingNumber });
        await Shipment.deleteOne({ trackingNumber });
    }

    const existingData = await ShippedItems.findOne({ trackingNumber });

    if (existingData) {
        // Document already exists, push the new IMEI values
        existingData.IMEI.push(...IMEI);
        await existingData.save();
    } else {
        // Document does not exist, create a new one
        const data = await ShippedItems.create({
            orderID: ShipmentData.orderID,
            orderNumber: ShipmentData.orderNumber,
            orderDate: ShipmentData.orderDate,
            trackingNumber: ShipmentData.trackingNumber,
            SKU: ShipmentData.SKU,
            quantity: ShipmentData.quantity,
            IMEI: IMEI,
            Remarks: null,
            DispatchedStatus: true
        });
    }

    // Update the status to 'Sold out' for the dispatched items
    await InventoryItem.updateMany(
        { 'items.IMEI': { $in: IMEI } },
        { $set: { 'items.$.Status': 'Sold out' } }
    );

    return res.status(200).json(
        new ApiResponse(200, "IMEI Dispatched Successfully!", ShipmentData.remainingItems - IMEI.length)
    )
});




// SHIPPED ITEM ROLE !
export const getAllShippedItems = tryCatch(async (req, res) => {
    const shippedData = await ShippedItems.find();

    if (!shippedData) {
        return res.status(404).json({ status: 404, success: false, message: "No Shipped data found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", shippedData)
    )
});

export const addRemarks = tryCatch(async (req, res) => {
    const { trackingNumber } = req.params;
    const { returnIMEI, comment, status } = req.body;
    validateRequiredFields([trackingNumber, comment, returnIMEI, status], res);

    const shippedItem = await ShippedItems.findOne({ trackingNumber });

    if (!shippedItem) {
        return res.status(404).json({ status: 404, success: false, message: "No tracking number found in inventory database" });
    }

    let returnItem = await ReturnItems.findOne({ trackingNumber });

    if (!returnItem) {
        // Create a new document in ReturnItems if trackingNumber doesn't exist
        returnItem = await ReturnItems.create({
            orderID: shippedItem.orderID,
            orderNumber: shippedItem.orderNumber,
            orderDate: shippedItem.orderDate,
            SKU: shippedItem.SKU,
            quantity: shippedItem.quantity,
            Remarks: null,
            DispatchedStatus: false,
            trackingNumber,
            Remarks: comment,
            IMEI: returnIMEI,
        });
    } else {
        // Push the returnIMEI to the IMEI array
        returnItem.IMEI.push(returnIMEI);
        returnItem.Remarks.push(comment);
        await returnItem.save();
    }


    // Remove the returnIMEI from the ShippedItems.IMEI array
    if (shippedItem.IMEI.length > 1) {
        await ShippedItems.findOneAndUpdate(
            { trackingNumber },
            { $pull: { IMEI: returnIMEI } }
        );
    } else {
        // If there is only one IMEI left, delete the whole document
        await ShippedItems.deleteOne({ trackingNumber });
    }
    // Update the status Acc To The Dispatcher Choice
    const updatedItem = await InventoryItem.findOneAndUpdate(
        { 'items.IMEI': returnIMEI },
        { $set: { 'items.$.Status': status } },
        { new: true } // Return the updated document
    );
    return res.status(200).json(
        new ApiResponse(200, "Remarks Added Successfully!", returnItem)
    )
});

// RETURN ITEM ROLE !
export const getAllReturnItems = tryCatch(async (req, res) => {
    const returnData = await ReturnItems.find();

    if (!returnData) {
        return res.status(404).json({ status: 404, success: false, message: "No Return data found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", returnData)
    )
});