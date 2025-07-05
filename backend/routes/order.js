const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const { newOrder } = require('../controllers/orderController');
const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);

module.exports = router;