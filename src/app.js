const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

require('./models');

const authRoutes    = require('./routes/auth.routes');
const marketRoutes  = require('./routes/market.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: '🍕 Food Delivery API is running!', status: 'ok', version: '1.0.0' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/markets',  marketRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;