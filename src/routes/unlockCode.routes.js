import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { deleteUlockCodeItem, getAllUnlockCodeItems, uploadUnlockCode } from "../controllers/unlockCode.controllers.js";
const unlockCodeRouter = Router();


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

unlockCodeRouter.route("/").get(verifyJWT, getAllUnlockCodeItems);
unlockCodeRouter.route("/upload").post(verifyJWT, upload.single('file'), uploadUnlockCode);
unlockCodeRouter.route("/delete/:id").delete(verifyJWT, deleteUlockCodeItem);

export default unlockCodeRouter;