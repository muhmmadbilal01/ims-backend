import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addDropdown, getAllDropdowns, handleActive } from "../controllers/settings.controllers.js";


const settingRouter = Router();


//routes with Authentication
settingRouter.route("/dropdown/get-all-dropdown").get(verifyJWT, getAllDropdowns);
settingRouter.route("/dropdown/add-dropdown").post(verifyJWT, addDropdown);
settingRouter.route("/dropdown/:id").put(verifyJWT, handleActive);


export default settingRouter;