const router = require('express').Router();
const { createMarket, getAllMarkets, getMarket, updateMarket, deleteMarket } = require('../controllers/market.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/',          getAllMarkets);
router.get('/:id',       getMarket);
router.post('/',         protect, authorize('market', 'admin'), createMarket);
router.put('/:id',       protect, authorize('market', 'admin'), updateMarket);
router.delete('/:id',    protect, authorize('market', 'admin'), deleteMarket);

module.exports = router;