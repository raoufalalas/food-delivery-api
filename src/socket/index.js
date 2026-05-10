const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // Customer يدخل على غرفة طلبه
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`📦 Joined order room: ${orderId}`);
    });

    // Driver يبعث موقعه
    socket.on('driver_location', ({ orderId, lat, lng }) => {
      io.to(`order_${orderId}`).emit('location_update', { lat, lng });
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };