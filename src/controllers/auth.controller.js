const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name, email, password: hashed, role, phone
    });

    res.status(201).json({
      message: 'Account created successfully',
      token: generateToken(user.id),
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user.id),
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };