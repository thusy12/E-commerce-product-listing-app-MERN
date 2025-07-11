const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');
const qs = require('qs');

//Get products = /api/v1/products
exports.getProducts = async (req,res,next)=>{
    const parsedQuery = qs.parse(req._parsedUrl.query);
    const resultsPerPage = 4;

    let buildQuery = () => {
        return new ApiFeatures(Product.find(), parsedQuery).search().filter();
    }

    const filteredProductsCount = await buildQuery().query.countDocuments({});
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;
    
    if(filteredProductsCount !== totalProductsCount){
        productsCount = filteredProductsCount;
    }

    const products = await buildQuery().paginate(resultsPerPage).query;
    
    res.status(200).json({
        success:true,
        count:productsCount,
        resultsPerPage,
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

//Get reviews = /api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async(req, res, next) =>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

//Delete review = /api/v1/review?id={reviewId}&productId={productId}
exports.deleteReview = catchAsyncError(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId);

    //Filtering the reviews which does not match the deleting review id
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    })

    //number of reviews after deletion
    const numOfReviews = reviews.length;

    //Calculating the average rating after deletion
    let ratings = reviews.reduce((acc, review) =>{
        return review.rating + acc;
    },0) / reviews.length;

    ratings = isNaN(ratings) ? 0 : ratings;

    //Update the product with new reviews, numOfReviews and ratings
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews,
        ratings
    })

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
})