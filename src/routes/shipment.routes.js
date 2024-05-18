import { Router } from "express";
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addRemarks,
    assignIMEI,
    dispatchShipment,
    dispatchTrackingNumber,
    getAllDispatchedShipments,
    getAllReturnItems,
    getAllShipments,
    getAllShippedItems,
    returnItemIMEI,
    uploadShipment
} from "../controllers/shipments.controllers.js";


const shipmentRouter = Router();

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

//ORDER PULLER
shipmentRouter.route("/").get(verifyJWT, getAllShipments);
shipmentRouter.route("/assignIMEI").post(verifyJWT, assignIMEI);
shipmentRouter.route("/returnIMEI").post(verifyJWT, returnItemIMEI);
shipmentRouter.route("/upload").post(verifyJWT, upload.single('file'), uploadShipment);

//DISPATCHER
shipmentRouter.route("/dispatched").get(verifyJWT, getAllDispatchedShipments);
shipmentRouter.route("/dispatch-tracking/:trackingNumber").post(verifyJWT, dispatchTrackingNumber);
shipmentRouter.route("/dispatch-shipment/:trackingNumber").post(verifyJWT, dispatchShipment);

//SHIPPED ITEMS
shipmentRouter.route("/all-shipped-items").get(verifyJWT, getAllShippedItems);
shipmentRouter.route("/add-remarks/:trackingNumber").post(verifyJWT, addRemarks);

//RETURN ITEMS
shipmentRouter.route("/all-returned-items").get(verifyJWT, getAllReturnItems);

export default shipmentRouter;