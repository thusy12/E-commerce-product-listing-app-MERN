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

//Create new product = /api/v1/admin/product/new
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

//Create review = /api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user.id,
        rating,
        comment
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    //Check if user has already reviewed the product
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    });

    if (isReviewed) {
        //Update the review
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user.id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        //Create new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    //Find the avg of product reviews for ratings field
    product.ratings = product.reviews.reduce((acc, review) =>{
        return review.rating + acc;
    },0) / product.reviews.length;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review added successfully"
    });
})