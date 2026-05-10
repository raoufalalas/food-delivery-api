const router = require('express').Router();
const { createProduct, getMarketProducts, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/:marketId/products',  getMarketProducts);
router.post('/',                   protect, authorize('market', 'admin'), createProduct);
router.put('/:id',                 protect, authorize('market', 'admin'), updateProduct);
router.delete('/:id',              protect, authorize('market', 'admin'), deleteProduct);

module.exports = router;