import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    series: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    storage: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },

}, {
    timestamps: true
});

export const Stock = mongoose.model('Stock', stockSchema);

