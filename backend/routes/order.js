const express = require('express');
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/authenticate');
const { newOrder, getSingleOrder, myOrders, orders, updateOrder } = require('../controllers/orderController');
const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser, myOrders);

// Admin routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizedRoles('admin','super admin'), orders);
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizedRoles('admin','super admin'), updateOrder);

module.exports = router;