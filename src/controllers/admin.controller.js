const { User, Market, Order, Product } = require('../models');
const { Op } = require('sequelize');

// إحصائيات عامة
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMarkets,
      totalOrders,
      totalDrivers,
      pendingOrders,
      deliveredOrders,
      cancelledOrders
    ] = await Promise.all([
      User.count(),
      Market.count(),
      Order.count(),
      User.count({ where: { role: 'driver' } }),
      Order.count({ where: { status: 'pending' } }),
      Order.count({ where: { status: 'delivered' } }),
      Order.count({ where: { status: 'cancelled' } })
    ]);

    // إجمالي المبيعات
    const revenueResult = await Order.sum('totalPrice', {
      where: { status: 'delivered' }
    });

    res.json({
      users: {
        total: totalUsers,
        drivers: totalDrivers,
        customers: totalUsers - totalDrivers
      },
      markets: { total: totalMarkets },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      revenue: {
        total: revenueResult || 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// عرض كل المستخدمين
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تفعيل أو تعطيل مستخدم
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ isActive: !user.isActive });

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        name: user.name,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// حذف مستخدم
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// طلبات آخر 7 أيام
const getRecentOrders = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await Order.findAll({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      },
      include: [
        { model: User,   as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User,   as: 'driver',   attributes: ['id', 'name'] },
        { model: Market, as: 'Market',   attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تقرير المطاعم
const getMarketsReport = async (req, res) => {
  try {
    const markets = await Market.findAll({
      include: [
        {
          model: Order,
          attributes: []
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    // عدد الطلبات لكل مطعم
    const report = await Promise.all(
      markets.map(async (market) => {
        const ordersCount   = await Order.count({ where: { marketId: market.id } });
        const deliveredCount = await Order.count({ where: { marketId: market.id, status: 'delivered' } });
        const revenue       = await Order.sum('totalPrice', { where: { marketId: market.id, status: 'delivered' } });

        return {
          id:         market.id,
          name:       market.name,
          isOpen:     market.isOpen,
          owner:      market.owner,
          stats: {
            totalOrders:     ordersCount,
            deliveredOrders: deliveredCount,
            revenue:         revenue || 0
          }
        };
      })
    );

    res.json({ markets: report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getRecentOrders,
  getMarketsReport
};