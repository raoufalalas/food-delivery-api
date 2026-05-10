const { Product, Market } = require('../models');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, marketId } = req.body;

    const market = await Market.findByPk(marketId);
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    if (market.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const product = await Product.create({
      name, description, price, marketId
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMarketProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { marketId: req.params.marketId, isAvailable: true }
    });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update(req.body);
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProduct, getMarketProducts, updateProduct, deleteProduct };