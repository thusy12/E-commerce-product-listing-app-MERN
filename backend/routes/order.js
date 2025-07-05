const express = require('express');
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const { newOrder, getSingleOrder, myOrders } = require('../controllers/orderController');
const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser, myOrders);

module.exports = router;