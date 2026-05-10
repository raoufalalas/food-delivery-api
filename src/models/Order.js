// src/models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 'accepted', 'preparing',
      'on_the_way', 'delivered', 'cancelled'
    ),
    defaultValue: 'pending',
  },
  totalPrice:     { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  deliveryAddress:{ type: DataTypes.STRING,         allowNull: false },
  customerId:     { type: DataTypes.UUID,            allowNull: false },
  driverId:       { type: DataTypes.UUID },
  marketId:       { type: DataTypes.UUID,            allowNull: false },
  notes:          { type: DataTypes.TEXT },
});

module.exports = Order;