const router   = require('express').Router();
const {
  getStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getRecentOrders,
  getMarketsReport
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// كل الـ routes دي للـ admin فقط
router.use(protect, authorize('admin'));

router.get('/stats',           getStats);
router.get('/users',           getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id',    deleteUser);
router.get('/orders/recent',   getRecentOrders);
router.get('/markets/report',  getMarketsReport);

module.exports = router;