import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'orderPuller', 'inventoryManager', 'dispatcher'],
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    // accountRecovery: {
    //     type: String,
    //     default: false
    // },
    // OTP: {
    //     type: Number,
    // },
}, {
    timestamps: true
}
)

UserSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return null;
    }
}

UserSchema.methods.generateAccessToken = function () {
    try {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                firstName: this.firstName,
                lastName: this.lastName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    } catch (error) {
        return null
    }
}

export const User = mongoose.model("User", UserSchema);