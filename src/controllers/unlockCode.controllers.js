import xlsx from 'xlsx';
import { tryCatch } from "../utils/tryCatch.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Unlockcode } from "../models/unlockcode.model.js";
import fs from 'fs';
import { isValidObjectId } from "mongoose";

export const uploadUnlockCode = tryCatch(async (req, res) => {
    if (!req.file || req.file?.filename === null || req.file?.filename === 'undefined') {
        return res.status(400).json(new ApiResponse(400, "No file uploaded"));
    }

    try {
        // Read the Excel file
        const workbook = xlsx.readFile(`./uploads/${req.file?.originalname}`);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Parse the sheet data
        const data = xlsx.utils.sheet_to_json(sheet);

        // Extract IMEI and UnlockCode data and save to database
        const items = data.map(row => ({
            IMEI: row.imei,
            UNLOCK_CODES: row.unlock_code,
            LotNumber: row.lot_number,
        }));

        // Get existing IMEIs from the database
        const existingIMEIs = await Unlockcode.distinct('IMEI', { IMEI: { $in: items.map(item => item.IMEI) } });

        const newItems = items.filter(item => console.log(!existingIMEIs.includes(item.IMEI)));

        if (newItems.length === 0) {
            return res.status(400).json(new ApiResponse(400, "All items already exist in the database"));
        }

        // Save new items to the database
        await Unlockcode.insertMany(newItems);

        return res.status(201).json(new ApiResponse(201, `Upload File Successfully (${req.file?.originalname})`))

    } catch (err) {
        return res.status(500).json(new ApiResponse(500, "Error Uploading file"));
    }
})

export const getAllUnlockCodeItems = tryCatch(async (req, res) => {
    const UnlockcodeData = await Unlockcode.find();

    if (!UnlockcodeData || UnlockcodeData.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Unlockcode data found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", UnlockcodeData)
    )
})

export const deleteUlockCodeItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid ID' });
    }
    const deletedUnlockcode = await Unlockcode.findByIdAndDelete(id);

    if (!deletedUnlockcode) {
        return res.status(404).json({ status: 404, success: false, message: "No Unlockcode Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "Unlockcode Deleted Successfully!")
    )
})