import { isValidObjectId } from "mongoose";
import { Stock } from "../models/stock.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { tryCatch } from "../utils/tryCatch.js";
import { validateRequiredFields } from "../utils/validations.js";

// Add Stock
export const addStock = tryCatch(async (req, res) => {
    const { brand, series, model, color, storage, condition, quantity } = req.body;
    console.log(brand, series, model, color, storage, condition, quantity)
    validateRequiredFields([brand, series, model, color, storage, condition, quantity], res);

    const stockItem = await Stock.create({
        brand,
        series,
        model,
        color,
        storage,
        condition,
        quantity
    });

    return res.status(201).json(
        new ApiResponse(201, "Stock Item Added Successfully!", stockItem)
    );
});

// Get All Stock
export const getAllStock = tryCatch(async (req, res) => {
    const stockItems = await Stock.find();

    if (!stockItems || stockItems.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Stock Items Found" });
    }

    return res.status(200).json(
        new ApiResponse(200, "Stock Items Retrieved Successfully!", stockItems)
    );
});

// Delete Stock
export const deleteStock = tryCatch(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Stock ID' });
    }

    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
        return res.status(404).json({ status: 404, success: false, message: "No Stock Item Found" });
    }

    return res.status(200).json(
        new ApiResponse(200, "Stock Item Deleted Successfully!", deletedStock)
    );
});

// Filter Stock
export const filterStock = tryCatch(async (req, res) => {
    const { Brand, Series, Model, Color, Storage, Condition } = req.query;

    // Check if all three fields are provided
    if (!Brand || !Series || !Model) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Brand, Series, and Model are all required for filtering"
        });
    }

    const filterCriteria = {
        brand: Brand.trim().toUpperCase(),
        series: Series.trim().toUpperCase(),
        model: Model.trim().toUpperCase()
    };

    // Add optional fields if they are present
    if (Color) {
        filterCriteria.color = Color.trim().toUpperCase();
    }
    if (Storage) {
        filterCriteria.storage = Storage.trim().toUpperCase();
    }
    if (Condition) {
        filterCriteria.condition = Condition.trim().toUpperCase();
    }

    const filteredStock = await Stock.find(filterCriteria);


    if (!filteredStock || filteredStock.length === 0) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "No Stock Items Found"
        });
    }

    return res.status(200).json(
        new ApiResponse(200, "Filtered Stock Items Retrieved Successfully!", filteredStock)
    );
});
export const updateStock = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate the ID
    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: "Invalid Stock ID" });
    }

    // Ensure the quantity is provided and is a valid number
    if (quantity === undefined || typeof quantity !== 'number') {
        return res.status(400).json({ status: 400, success: false, message: "Quantity is required and must be a number" });
    }

    // Update only the quantity field
    const updatedStock = await Stock.findByIdAndUpdate(id, { quantity }, { new: true });

    // Handle the case where the stock item was not found
    if (!updatedStock) {
        return res.status(404).json({ status: 404, success: false, message: "Stock Item Not Found" });
    }

    // Return the updated stock item
    return res.status(200).json(
        new ApiResponse(200, "Stock Item Updated Successfully!", updatedStock)
    );
});
