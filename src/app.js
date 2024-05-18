import express from "express"
import cors from "cors"
import {
    loginUser,
    logoutUser,
    recoverPassword,
    registerUser,
    resetPassword,
    verifyOTP
} from "./controllers/user.controllers.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.static("public"))
app.use(express.json());

//routes


//routes import
import userRouter from './routes/user.routes.js'
import inventoryRouter from "./routes/inventory.routes.js"
import shipmentRouter from "./routes/shipment.routes.js"
import attributesRouter from "./routes/attributes.routes.js"
import settingRouter from "./routes/settings.route.js"
import unlockCodeRouter from "./routes/unlockCode.routes.js"
import { ApiResponse } from "./utils/ApiResponse.js"
import stockRouter from "./routes/stock.route.js"

app.get("/", (req, res) => {
    res.send("IMS Gallery!");
});

app.route("/api/v1/register").post(registerUser);
app.route("/api/v1/login").post(loginUser);
app.route("/api/v1/logout").post(logoutUser);
// resetPass (user will enter email) -> verifyOTP (user will enter correct OTP) -> newPass (user will enter newPass and confirmPass)
app.route("/api/v1/reset-password").post(resetPassword);
app.route("/api/v1/verify-otp").post(verifyOTP);
// after verifying OTP user will be accessable to enter his new password
app.route("/api/v1/recover-password").post(recoverPassword);



//routes declaration
// http://localhost:8000/api/v1/users
app.use("/api/v1/users", userRouter)
app.use("/api/v1/settings", settingRouter)
app.use("/api/v1/inventory", inventoryRouter)
app.use("/api/v1/shipments", shipmentRouter)
app.use("/api/v1/unlockcode", unlockCodeRouter)
app.use("/api/v1/attributes", attributesRouter)
app.use("/api/v1/stock", stockRouter)




// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(new ApiResponse(500, "Something Broke !", err));
});

export { app };