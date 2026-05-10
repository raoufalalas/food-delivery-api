const router = require('express').Router();
const {
  createOrder, getMyOrders, getMarketOrders,
  updateOrderStatus, assignDriver, getAvailableOrders, getAllOrders
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');

// Customer
router.post('/',       protect, authorize('customer'),            createOrder);
router.get('/my',      protect, authorize('customer'),            getMyOrders);

// Market
router.get('/market',  protect, authorize('market'),              getMarketOrders);

// Driver
router.get('/available', protect, authorize('driver'),            getAvailableOrders);
router.patch('/:id/assign', protect, authorize('driver'),         assignDriver);

// Market + Admin — تغيير الحالة
router.patch('/:id/status', protect, authorize('market','admin'), updateOrderStatus);

// Admin فقط
router.get('/',        protect, authorize('admin'),               getAllOrders);

module.exports = router;