const express = require('express');
const { route } = require('../app');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require('../middlewares/authenticate');

router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/product/new').post(isAuthenticatedUser, authorizedRoles('admin', 'super admin'), newProduct);
router.route('/product/:id')
                            .get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct);

module.exports = router;