import mongoose, { Schema } from "mongoose";


const InventoryItemSchema = new mongoose.Schema({
    Model: {
        type: String,
        required: true
    },
    Brand: {
        type: String,
        required: true
    },
    Network: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        enum: ['Available', 'Sold out', 'In progress', 'BER', 'Problem'],
        default: 'Available'
    },
    IMEI: {
        type: Number,
        maxlength: 15,
        required: true
    }
}, { timestamps: true });


const InventorySchema = new mongoose.Schema({
    LotID: {
        type: String,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
    BoughtQuantity: {
        type: Number,
        required: true
    },
    ReceivedQuantity: {
        type: Number,
        required: true
    },
    items: [InventoryItemSchema]
}, { timestamps: true });

export const InventoryItem = mongoose.model('InventoryItem', InventorySchema);
