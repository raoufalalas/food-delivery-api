// src/models/Market.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Market = sequelize.define('Market', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name:        { type: DataTypes.STRING,  allowNull: false },
  description: { type: DataTypes.TEXT },
  address:     { type: DataTypes.STRING,  allowNull: false },
  phone:       { type: DataTypes.STRING },
  image:       { type: DataTypes.STRING },
  isOpen:      { type: DataTypes.BOOLEAN, defaultValue: true },
  ownerId:     { type: DataTypes.UUID,    allowNull: false },
});

module.exports = Market;