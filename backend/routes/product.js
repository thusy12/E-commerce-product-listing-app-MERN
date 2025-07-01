const express = require('express');
const { route } = require('../app');
const { getProducts } = require('../controllers/productController');
const router = express.Router();

router.route('/products').get(getProducts)

module.exports = router;