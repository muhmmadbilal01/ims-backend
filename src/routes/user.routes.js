import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    changeUserPassword,
    deleteUser,
    getAllUsers,
    getSingleUser,
    toggleActiveStatus,
} from "../controllers/user.controllers.js";


const userRouter = Router();


//routes with Authentication

userRouter.route("/").get(verifyJWT, getAllUsers);
userRouter.route("/toggle-active/:userID").post(verifyJWT, toggleActiveStatus);
userRouter.route("/get-single-user").get(verifyJWT, getSingleUser);
userRouter.route("/delete-user/:userID").delete(verifyJWT, deleteUser);
userRouter.route("/change-password").post(verifyJWT, changeUserPassword);


export default userRouter;