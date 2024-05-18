import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addBrandItem,
    addCategoryItem,
    addColorItem,
    addModelItem,
    addNetworkItem,
    addSeriesItem,
    addStorageItem,
    deleteBrandItem,
    deleteCategoryItem,
    deleteColorItem,
    deleteModelItem,
    deleteNetworkItem,
    deleteSeriesItem,
    deleteStorageItem,
    getAllBrandItems,
    getAllCategoryItems,
    getAllColorItems,
    getAllModelItems,
    getAllNetworkItems,
    getAllSeriesItems,
    getAllStorageItems,
    updateBrandItem,
    updateCategoryItem,
    updateColorItem,
    updateModelItem,
    updateNetworkItem,
    updateSeriesItem,
    updateStorageItem
} from "../controllers/attributes.controllers.js";


const attributesRouter = Router();

// NETWORK
attributesRouter.route("/network/get-all-network").get(verifyJWT, getAllNetworkItems);
attributesRouter.route("/network/network-add").post(verifyJWT, addNetworkItem);
attributesRouter.route("/network/network-update/:id").put(verifyJWT, updateNetworkItem);
attributesRouter.route("/network/network-delete/:id").delete(verifyJWT, deleteNetworkItem);

// STORAGE
attributesRouter.route("/storage/get-all-storage").get(verifyJWT, getAllStorageItems);
attributesRouter.route("/storage/storage-add").post(verifyJWT, addStorageItem);
attributesRouter.route("/storage/storage-update/:id").put(verifyJWT, updateStorageItem);
attributesRouter.route("/storage/storage-delete/:id").delete(verifyJWT, deleteStorageItem);

// BRAND
attributesRouter.route("/brand/get-all-brand").get(verifyJWT, getAllBrandItems);
attributesRouter.route("/brand/brand-add").post(verifyJWT, addBrandItem);
attributesRouter.route("/brand/brand-update/:id").put(verifyJWT, updateBrandItem);
attributesRouter.route("/brand/brand-delete/:id").delete(verifyJWT, deleteBrandItem);

// CATEGORY
attributesRouter.route("/category/get-all-category").get(verifyJWT, getAllCategoryItems);
attributesRouter.route("/category/category-add").post(verifyJWT, addCategoryItem);
attributesRouter.route("/category/category-update/:id").put(verifyJWT, updateCategoryItem);
attributesRouter.route("/category/category-delete/:id").delete(verifyJWT, deleteCategoryItem);

// MODEL
attributesRouter.route("/model/get-all-model").get(verifyJWT, getAllModelItems);
attributesRouter.route("/model/model-add").post(verifyJWT, addModelItem);
attributesRouter.route("/model/model-update/:id").put(verifyJWT, updateModelItem);
attributesRouter.route("/model/model-delete/:id").delete(verifyJWT, deleteModelItem);

// SERIES
attributesRouter.route("/series/get-all-series").get(verifyJWT, getAllSeriesItems);
attributesRouter.route("/series/series-add").post(verifyJWT, addSeriesItem);
attributesRouter.route("/series/series-update/:id").put(verifyJWT, updateSeriesItem);
attributesRouter.route("/series/series-delete/:id").delete(verifyJWT, deleteSeriesItem);

// COLOR
attributesRouter.route("/color/get-all-color").get(verifyJWT, getAllColorItems);
attributesRouter.route("/color/color-add").post(verifyJWT, addColorItem);
attributesRouter.route("/color/color-update/:id").put(verifyJWT, updateColorItem);
attributesRouter.route("/color/color-delete/:id").delete(verifyJWT, deleteColorItem);

export default attributesRouter;