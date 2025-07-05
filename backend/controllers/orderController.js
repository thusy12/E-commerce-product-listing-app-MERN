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

//Get single order = /api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async(req, res, next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        order
    });
})