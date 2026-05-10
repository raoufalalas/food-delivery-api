require('dotenv').config();
const http                     = require('http');
const app                      = require('./src/app');
const { connectDB, sequelize } = require('./src/config/database');
const { initSocket }           = require('./src/socket');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};

startServer();