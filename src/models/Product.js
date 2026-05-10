// src/models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name:        { type: DataTypes.STRING,  allowNull: false },
  description: { type: DataTypes.TEXT },
  price:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  image:       { type: DataTypes.STRING },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  marketId:    { type: DataTypes.UUID,    allowNull: false },
});

module.exports = Product;