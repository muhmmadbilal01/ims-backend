import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addStock, getAllStock, deleteStock, filterStock } from "../controllers/stock.controllers.js";

const stockRouter = Router();

// Routes with Authentication
stockRouter.route("/get-all-stock").get(verifyJWT, getAllStock);
stockRouter.route("/add-stock").post(verifyJWT, addStock);
stockRouter.route("/:id").delete(verifyJWT, deleteStock);
stockRouter.route("/filter").get(verifyJWT, filterStock);

export default stockRouter;
