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
router.route('/product/:id')
                            .get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct);
router.route('/review')
                        .put(isAuthenticatedUser, createReview)
                        .delete(isAuthenticatedUser, deleteReview);
router.route('/reviews').get(getReviews);

//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser, authorizedRoles('admin', 'super admin'),upload.array('images'), newProduct);
router.route('/admin/products').get(isAuthenticatedUser, authorizedRoles('admin', 'super admin'), getAdminProducts);

module.exports = router;