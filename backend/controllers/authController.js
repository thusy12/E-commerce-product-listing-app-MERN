const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");

//Register user = /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    let avatar;
    if (req.file) {
        avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res, "New user created successfully");
})

//Login user = /api/v1/login
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

//Logout user = /api/v1/logout
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

//Forgot Password = /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave: false});

    // Create reset password URL
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this, please ignore this email.`;

    try {
        // Send email with reset token
        await sendEmail({
            email: user.email,
            subject: "Listing cart password Recovery",
            message: message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})

//Reset Password = /api/v1/password/reset/:id
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ 
        resetPasswordToken, 
        resetPasswordTokenExpire: { 
            $gt: Date.now() 
        }
    })

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save(validateBeforeSave = false);

    sendToken(user, 201, res, "Password reset successfully");
})

//change password = /api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // Check if old password is correct
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler("Old password is incorrect", 401));
    }

    // Check if new password and confirm password match
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("New password and confirm password do not match", 401));
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        success: true
    })
})

//Get User Profile = /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

//Update profile = /api/v1/profile/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    let avatar;
    if (req.file) {
        avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
        newUserData = {...newUserData, avatar};
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });
});

//Admin: Get all users = /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//Admin: Get specific user = /api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with this id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Update user = /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorHandler(`User not found with this id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user
    })
})

//Admin: Delete user = /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with this id: ${req.params.id}`, 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})