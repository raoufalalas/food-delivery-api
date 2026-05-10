const { io } = require('socket.io-client');

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);

  // انضم لغرفة الطلب الجديد
  socket.emit('join_order', '5578c4fc-a6bd-4b99-9cc5-e4978114f4d2');
  console.log('📦 Joined order room - waiting for updates...');
});

socket.on('order_status_update', (data) => {
  console.log('🔔 Order updated!', JSON.stringify(data, null, 2));
});

socket.on('location_update', (data) => {
  console.log('📍 Driver location:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});