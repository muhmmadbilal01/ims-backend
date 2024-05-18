import bcrypt from "bcryptjs"
import otpGenerator from 'otp-generator';
import { ApiResponse } from "../utils/ApiResponse.js";
import { tryCatch } from "../utils/tryCatch.js";
import { User } from "../models/user.model.js";
import { validateRequiredFields } from "../utils/validations.js";
import { isValidObjectId } from "mongoose";
import { notFound } from "../utils/notFound.js";

const registerUser = tryCatch(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;

    validateRequiredFields([firstName, lastName, email, password, role, confirmPassword], res);

    if (!(password === confirmPassword)) {
        return res.status(400).json({ status: 400, success: false, message: "The password doesn't match the confirmed password!" });
    }

    //checking if user email already exist or not
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
        return res.status(409).json({ status: 409, success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword
    })

    const createdUser = await User.findById(user._id).select(
        "-password -OTP"
    )

    return res.status(201).json(
        new ApiResponse(201, "User Registered Successfull!", createdUser)
    )
});

const loginUser = tryCatch(async (req, res) => {
    const { email, password, role } = req.body;

    //checking if any field is empty
    validateRequiredFields([email, password, role], res);

    const user = await User.findOne({ email, role });
    notFound(user, res);
    if (!user?.active) {
        return res.status(401).json({ status: 401, success: false, message: "Account is inactive" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ status: 401, success: false, message: "Incorrect password" });
    }

    //generating the token and saving it in the database
    try {
        const token = user.generateAccessToken();
        user.token = token; // saving token in DB
        await user.save();
        const newUser = await User.findById(user._id).select("-password -OTP");
        return res.status(201).json(
            new ApiResponse(201, "User Logged In Successfully!", newUser)
        );
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Failed to generate token" });
    }
})

const logoutUser = tryCatch(async (req, res) => {
    const { userID } = req.query;
    if (!isValidObjectId(userID)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid userID' });
    }
    const user = await User.findById(userID);
    notFound(user, res)
    // clearing the token
    user.token = null;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, "User Logged Out Successfully!")
    );
})

const toggleActiveStatus = tryCatch(async (req, res) => {
    const { userID } = req.params;

    const user = await User.findById(userID);
    notFound(user, res);

    user.active = !user.active; // Toggle active status
    await user.save();

    return res.status(200).json({
        status: 200,
        success: true,
        message: user.active ? "User activated successfully" : "User deactivated successfully",
    });
});

const getAllUsers = tryCatch(async (req, res) => {
    const users = await User.find().select("-password -token -OTP");
    if (!users || users.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Users Found" })
    }
    return res.status(200).json(
        new ApiResponse(200, "", users)
    )
})

const getSingleUser = tryCatch(async (req, res) => {
    const { _id } = req.user;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid userID' });
    }

    const singleUser = await User.findById(_id).select("-password -token -OTP")
    if (!singleUser) {
        return res.status(404).json({ status: 404, success: false, message: "No User Found" })
    }
    return res.status(200).json(
        new ApiResponse(200, "", singleUser)
    )
})

const deleteUser = tryCatch(async (req, res) => {
    const { userID } = req.params;

    if (!isValidObjectId(userID)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid userID' });
    }

    const deletedUser = await User.findByIdAndDelete(userID).select("-password -token -OTP")
    if (!deletedUser) {
        return res.status(404).json({ status: 404, success: false, message: "No User Found" })
    }
    return res.status(200).json(
        new ApiResponse(200, "User Deleted Successfully!")
    )
})

const changeUserPassword = tryCatch(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;
    validateRequiredFields([oldPassword, newPassword], res);

    if (oldPassword === newPassword) {
        return res.status(400).json({ status: 400, success: false, message: 'New password must be different from old password' });
    }

    // Check if userID is a valid ObjectId
    if (!isValidObjectId(_id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid userID' });
    }
    const user = await User.findById(_id);
    notFound(user, res)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        return res.status(401).json({ status: 401, success: false, message: "Incorrect password" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)

    //saving the new pass in DB
    user.password = hashPassword;
    await user.save();
    return res.status(200).json(
        new ApiResponse(200, "Password Changed Successfully!")
    )
})

const resetPassword = tryCatch(async (req, res) => {

    const { email } = req.body;
    validateRequiredFields([email], res)

    const user = await User.findOne({ email })
    notFound(user, res)
    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });

    // Save OTP in the user document
    user.OTP = otp;
    await user.save();

    return res.status(200).json(new ApiResponse(200, "OTP sent to email", otp));
});

const verifyOTP = tryCatch(async (req, res) => {

    const { OTP, email } = req.body;
    validateRequiredFields([email, OTP], res)

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ status: 404, success: false, message: "Invalid OTP" });
    }
    if (!(user.OTP === OTP)) {
        return res.status(400).json({ status: 400, success: false, message: "Invalid OTP" });
    }

    user.accountRecovery = true;
    await user.save();

    return res.status(200).json(new ApiResponse(200, "OTP Verified"));
});

const recoverPassword = tryCatch(async (req, res) => {
    const { newPassword, confirmPassword, email } = req.body;
    validateRequiredFields([newPassword, confirmPassword, email], res)

    if (!(confirmPassword === newPassword)) {
        return res.status(400).json({ status: 400, success: false, message: 'New password and confirm password must be same' });
    }

    const user = await User.findOne({ email });
    notFound(user, res);

    if (user.accountRecovery === false) {
        return res.status(500).json({ status: 500, success: false, message: 'Internal Server Error While Fetching User' });

    }
    // hashing the passcode
    const newHashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = newHashedPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, "Account Recovered Successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    toggleActiveStatus,
    getAllUsers,
    getSingleUser,
    deleteUser,
    changeUserPassword,
    resetPassword,
    verifyOTP,
    recoverPassword
};