const express = require('express');
const { route } = require('../app');
const { getProducts, newProduct } = require('../controllers/productController');
const router = express.Router();

router.route('/products').get(getProducts)
router.route('/product/new').post(newProduct)

module.exports = router;