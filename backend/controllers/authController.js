const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res, "New user created successfully");
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if password matches
    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 201, res, "User logged in successfully");
})

exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
})