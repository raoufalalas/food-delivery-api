const User    = require('./User');
const Market  = require('./Market');
const Product = require('./Product');
const Order   = require('./Order');

User.hasMany(Market,   { foreignKey: 'ownerId', as: 'markets' });
Market.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Market.hasMany(Product,  { foreignKey: 'marketId' });
Product.belongsTo(Market, { foreignKey: 'marketId' });

// Customer orders
User.hasMany(Order,   { as: 'customerOrders', foreignKey: 'customerId' });
Order.belongsTo(User, { as: 'customer',       foreignKey: 'customerId' });

// Driver orders
User.hasMany(Order,   { as: 'driverOrders', foreignKey: 'driverId' });
Order.belongsTo(User, { as: 'driver',       foreignKey: 'driverId' });

// Market orders
Market.hasMany(Order,  { foreignKey: 'marketId' });
Order.belongsTo(Market, { foreignKey: 'marketId' });

module.exports = { User, Market, Product, Order };