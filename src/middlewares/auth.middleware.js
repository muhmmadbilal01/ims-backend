import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { tryCatch } from "../utils/tryCatch.js";

const verifyJWT = tryCatch(async (req, res, next) => {
    try {
        //taking token
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken

        if (!token) {
            return res.status(401).json({ status: 401, success: false, message: "Unauthorized request" });
        }
        //decoding token and verifying it 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid Access Token" });
        }
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({ status: 401, success: false, message: error?.message || "Invalid access token!" });
    }
})

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next(); // User is an admin, allow access
    }
    return res.status(403).json({ status: 403, success: false, message: 'Forbidden' });
};

export {
    verifyJWT,
    isAdmin
}