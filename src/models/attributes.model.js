import mongoose, { Schema } from "mongoose";

//NETWORK
const NetworkItemSchema = new Schema({
    Network: {
        type: String,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const NetworkItem = mongoose.model('NetworkItem', NetworkItemSchema);

//STORAGE
const StorageItemSchema = new Schema({
    Storage: {
        type: String,
        uppercase: true,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const StorageItem = mongoose.model('StorageItem', StorageItemSchema);

//BRAND
const BrandItemSchema = new Schema({
    Brand: {
        type: String,
        uppercase: true,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const BrandItem = mongoose.model('BrandItem', BrandItemSchema);

//CATEGORY
const CategoryItemSchema = new Schema({
    Category: {
        type: String,
        uppercase: true,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const CategoryItem = mongoose.model('CategoryItem', CategoryItemSchema);

//MODEL
const ModelItemSchema = new Schema({
    Model: {
        type: String,
        uppercase: true,
        required: true
    },
    Brand: {
        type: String,
        uppercase: true,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const ModelItem = mongoose.model('ModelItem', ModelItemSchema);

//SERIES
const SeriesItemSchema = new Schema({
    Series: {
        type: String,
        uppercase: true,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const SeriesItem = mongoose.model('SeriesItem', SeriesItemSchema);

//COLOR
const ColorItemSchema = new Schema({
    Color: {
        type: String,
        uppercase: true,
        required: true
    },
    AddedBy: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const ColorItem = mongoose.model('ColorItem', ColorItemSchema);
