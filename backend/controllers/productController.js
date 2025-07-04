const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');
const qs = require('qs');

//Get products = /api/v1/products
exports.getProducts = async (req,res,next)=>{
    const parsedQuery = qs.parse(req._parsedUrl.query);
    const resultsPerPage = 5;
    const apiFeatures = new ApiFeatures(Product.find(), parsedQuery).search().filter().paginate(resultsPerPage);
    const products = await apiFeatures.query;
    
    res.status(200).json({
        success:true,
        count:products.length,
        products
    })
}

//Create new product = /api/v1/product/new
exports.newProduct = catchAsyncError(async (req,res,next)=>{
    req.body.user = req.user.id; // Adding user to the product schema
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
        message:"New product created successfully"
    })
})

//Get single product = /api/v1/product/:id
exports.getSingleProduct = async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 400));
    }
    res.status(200).json({
        success:true,
        product
    })
}

//Update product = /api/v1/product/:id
exports.updateProduct = async (req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        product,
        message:"Product updated successfully"
    })
}

//Delete product = /api/v1/product/:id
exports.deleteProduct = async (req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    
    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
}