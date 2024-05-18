import mongoose, { Schema } from "mongoose";

const DropdownitemSchema = new Schema({
    DropdownName: {
        type: String,
    },
    Active: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

export const Dropdown = mongoose.model('Dropdown', DropdownitemSchema);
