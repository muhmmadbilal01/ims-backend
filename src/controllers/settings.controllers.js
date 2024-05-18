import { isValidObjectId } from "mongoose";
import { Dropdown } from "../models/settings.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { tryCatch } from "../utils/tryCatch.js";
import { validateRequiredFields } from "../utils/validations.js";


export const handleActive = tryCatch(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid ID' });
    }

    const dropdownItem = await Dropdown.findById(id);
    if (!dropdownItem) {
        return res.status(404).json(
            new ApiResponse(404, "Dropdown item not found")
        );
    }
    dropdownItem.Active = !dropdownItem.Active;
    await dropdownItem.save();

    return res.status(200).json(
        new ApiResponse(200, dropdownItem.Active ? "Dropdown activated successfully" : "Dropdown deactivated successfully",)
    );
})

export const addDropdown = tryCatch(async (req, res) => {
    const { DropdownName, Active } = req.body;

    validateRequiredFields([DropdownName], res)

    const data = await Dropdown.create({ DropdownName, Active });
    if (!data) {
        return res.status(500).json(
            new ApiResponse(200, "Failed to add dropdown item")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "Dropdown item added successfully")
    );
})


export const getAllDropdowns = tryCatch(async (req, res) => {
    const data = await Dropdown.find();
    if (!data) {
        return res.status(400).json({ status: 400, success: false, message: 'Dropdown Data Not Found' });
    }
    return res.status(200).json(
        new ApiResponse(200, "Retrieved all dropdown items successfully", data)
    );
});
