const { Market, Product, User } = require('../models');

const createMarket = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;

    const market = await Market.create({
      name, description, address, phone,
      ownerId: req.user.id
    });

    res.status(201).json({ message: 'Market created', market });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.findAll({
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({ markets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMarket = async (req, res) => {
  try {
    const market = await Market.findByPk(req.params.id, {
      include: [{ model: Product, as: 'Products' }]
    });

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    res.json({ market });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMarket = async (req, res) => {
  try {
    const market = await Market.findByPk(req.params.id);

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    if (market.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await market.update(req.body);
    res.json({ message: 'Market updated', market });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMarket = async (req, res) => {
  try {
    const market = await Market.findByPk(req.params.id);

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    if (market.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await market.destroy();
    res.json({ message: 'Market deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createMarket, getAllMarkets, getMarket, updateMarket, deleteMarket };