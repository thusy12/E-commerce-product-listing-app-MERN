const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");

//Create new order = /api/v1/order/new
exports.newOrder = catchAsyncError(async(req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user.id
    });

    res.status(201).json({
        success: true,
        order,
        message: "New order created successfully"
    });
})