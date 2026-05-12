const { Order, Product, Market, User } = require('../models');
const { Op } = require('sequelize');
const { getIO } = require('../socket');
// Customer يعمل طلب جديد
const createOrder = async (req, res) => {
  try {
    const { marketId, deliveryAddress, notes, items } = req.body;

    const market = await Market.findByPk(marketId);
    if (!market) return res.status(404).json({ message: 'Market not found' });
    if (!market.isOpen) return res.status(400).json({ message: 'Market is closed' });

    // حساب السعر الإجمالي
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isAvailable) {
        return res.status(400).json({ message: `Product ${item.productId} not available` });
      }
      totalPrice += parseFloat(product.price) * item.quantity;
    }

    const order = await Order.create({
      customerId: req.user.id,
      marketId,
      deliveryAddress,
      notes,
      totalPrice,
      status: 'pending'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// عرض طلبات الـ Customer
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.user.id },
      include: [
        { model: Market, as: 'Market', attributes: ['id', 'name', 'address'] },
        { model: User,   as: 'driver', attributes: ['id', 'name', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// عرض طلبات المطعم
const getMarketOrders = async (req, res) => {
  try {
    const market = await Market.findOne({ where: { ownerId: req.user.id } });
    if (!market) return res.status(404).json({ message: 'You have no market' });

    const orders = await Order.findAll({
      where: { marketId: market.id },
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Market يقبل أو يرفض الطلب
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const allowedTransitions = {
      pending:    ['accepted', 'cancelled'],
      accepted:   ['preparing', 'cancelled'],
      preparing:  ['on_the_way'],
      on_the_way: ['delivered'],
    };

    const current = order.status;
    if (!allowedTransitions[current]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from "${current}" to "${status}"`
      });
    }

    await order.update({ status });
     // 🔴 أبعت للـ Customer إن الحالة اتغيرت
    getIO().to(`order_${order.id}`).emit('order_status_update', {
      orderId: order.id,
      status,
      updatedAt: new Date()
    });
    res.json({ message: `Order status updated to "${status}"`, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Driver يتعين للطلب
const assignDriver = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['accepted', 'preparing'].includes(order.status)) {
      return res.status(400).json({ message: 'Order not ready for pickup' });
    }

    await order.update({ driverId: req.user.id, status: 'on_the_way' });
    // 🔴 أبلغ الـ Customer إن السائق جاي
    getIO().to(`order_${order.id}`).emit('order_status_update', {
      orderId: order.id,
      status: 'on_the_way',
      driverId: req.user.id,
      updatedAt: new Date()
    });
    res.json({ message: 'Driver assigned successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// عرض الطلبات المتاحة للـ Driver
const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: ['accepted', 'preparing'], driverId: null },
      include: [
        { model: Market, as: 'Market', attributes: ['id', 'name', 'address'] }
      ]
    });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin يشوف كل الطلبات
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User,   as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User,   as: 'driver',   attributes: ['id', 'name', 'phone'] },
        { model: Market, as: 'Market',   attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Driver يشوف طلباته هو
const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { driverId: req.user.id },
      include: [
        { model: Market, as: 'Market', attributes: ['id', 'name'] },
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder, getMyOrders, getMarketOrders,
  updateOrderStatus, assignDriver, getAvailableOrders, getAllOrders, getMyDeliveries
};
