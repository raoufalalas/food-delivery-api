const { body } = require('express-validator');

const createOrderValidator = [
  body('marketId')
    .notEmpty().withMessage('Market ID is required')
    .isUUID().withMessage('Invalid market ID'),

  body('deliveryAddress')
    .trim()
    .notEmpty().withMessage('Delivery address is required')
    .isLength({ min: 5 }).withMessage('Address too short'),

  body('items')
    .isArray().withMessage('Items must be an array'),
];

const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled'])
    .withMessage('Invalid status value')
];

module.exports = { createOrderValidator, updateStatusValidator };