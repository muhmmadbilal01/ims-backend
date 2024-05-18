import mongoose, { Schema } from "mongoose";

const UnlockcodeSchema = new Schema({
    IMEI: {
        type: Number,
        required: true,
        minlength: 15,
        maxlength: 15
    },
    LotNumber: {
        type: String,
        required: true
    },
    UNLOCK_CODES: {
        type: Number,
        required: true
    },
}, { timestamps: true });

export const Unlockcode = mongoose.model('Unlockcode', UnlockcodeSchema);
