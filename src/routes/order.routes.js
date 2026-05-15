const router = require('express').Router();
const {
  createOrder, getMyOrders, getMarketOrders,
  updateOrderStatus, assignDriver, getAvailableOrders, getAllOrders, getMyDeliveries
} = require('../controllers/order.controller');
const { protect, authorize }   = require('../middleware/auth');
const validate                 = require('../middleware/validate');
const { createOrderValidator, updateStatusValidator } = require('../validators/order.validator');

router.post('/',            protect, authorize('customer'), createOrderValidator, validate, createOrder);
router.get('/my',           protect, authorize('customer'), getMyOrders);
router.get('/market',       protect, authorize('market'),   getMarketOrders);
router.get('/my-deliveries', protect, authorize('driver'), getMyDeliveries);
router.get('/available',    protect, authorize('driver'),   getAvailableOrders);
router.patch('/:id/assign', protect, authorize('driver'),   assignDriver);
router.patch('/:id/status', protect, authorize('market', 'admin', 'driver', 'customer'), updateStatusValidator, validate, updateOrderStatus);
router.get('/',             protect, authorize('admin'),    getAllOrders);

module.exports = router;