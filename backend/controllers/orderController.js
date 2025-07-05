const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
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

//Get logged in user orders = /api/v1/myorders
exports.myOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    });
})

//Admin: get all orders = /api/v1/admin/orders
exports.orders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
})

//Admin: update order status = /api/v1/admin/order/:id
exports.updateOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 400));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("Order has been already delivered", 400));
    }

    order.orderItems.forEach(async(item) => {
        await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order status updated successfully"
    });
})

//Admin: delete order = /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 400));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
})


async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({ validateBeforeSave: false });
}