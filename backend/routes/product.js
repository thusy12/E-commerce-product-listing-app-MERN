const express = require('express');
const { route } = require('../app');
const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    createReview, 
    getReviews, 
    deleteReview,
    getAdminProducts
} = require('../controllers/productController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require('../middlewares/authenticate');

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads', 'product');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({storage:multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  }),
});

router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/product/:id').get(getSingleProduct);                           
router.route('/review').put(isAuthenticatedUser, createReview);

//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser, authorizedRoles('admin', 'super admin'),upload.array('images'), newProduct);
router.route('/admin/products').get(isAuthenticatedUser, authorizedRoles('admin', 'super admin'), getAdminProducts);
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizedRoles('admin', 'super admin'), deleteProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizedRoles('admin', 'super admin'), upload.array('images'), updateProduct);
router.route('/admin/reviews').get(isAuthenticatedUser, authorizedRoles('admin', 'super admin'), getReviews);
router.route('/admin/review').delete(isAuthenticatedUser, authorizedRoles('admin', 'super admin'), deleteReview);
module.exports = router;