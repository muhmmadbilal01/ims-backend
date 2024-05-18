import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addInventoryItem,
    deleteInventory,
    deleteInventoryItems,
    getAllInventoryItems,
    updateInventory,
    updateInventoryItem,
    uploadInventoryItem
} from "../controllers/inventory.controllers.js";
import multer from "multer";
const inventoryRouter = Router();



const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });


inventoryRouter.route("/").get(verifyJWT, getAllInventoryItems);
inventoryRouter.route("/add").post(verifyJWT, addInventoryItem);
inventoryRouter.route("/upload").post(verifyJWT, upload.single('file'), uploadInventoryItem);
inventoryRouter.route("/update").put(verifyJWT, updateInventory);
inventoryRouter.route("/update-item").put(verifyJWT, updateInventoryItem);
inventoryRouter.route("/delete/:id").delete(verifyJWT, deleteInventory);
inventoryRouter.route("/delete-item/:id").delete(verifyJWT, deleteInventoryItems);

export default inventoryRouter;