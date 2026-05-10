// =============================================
// server.js — نقطة دخول المشروع
// =============================================

// تحميل المتغيرات من ملف .env
require('dotenv').config();

// استيراد المكتبات
const http = require('http'); // HTTP Server الأصلي من Node.js

// استيراد ملفات المشروع
const app                      = require('./src/app');
const { connectDB, sequelize } = require('./src/config/database');
const { initSocket }           = require('./src/socket');

// البورت والبيئة من المتغيرات أو قيمة افتراضية
const PORT     = process.env.PORT     || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// =============================================
// دالة تشغيل السيرفر
// =============================================
const startServer = async () => {
  try {
    // الخطوة 1: الاتصال بقاعدة البيانات
    await connectDB();

    // الخطوة 2: مزامنة الجداول
    // في Development: بنعدّل الجداول تلقائياً (alter: true)
    // في Production: بنتأكد من الاتصال بس — مش بنعدّل الجداول
    // عشان في Production ممكن تضيع بيانات لو عدّلنا بالغلط
    if (NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Tables synced (development mode)');
    } else {
      await sequelize.authenticate();
      console.log('✅ Database authenticated (production mode)');
    }

    // الخطوة 3: إنشاء HTTP Server من Express app
    // بنعمل ده عشان Socket.IO محتاج HTTP Server مش Express مباشرة
    const server = http.createServer(app);

    // الخطوة 4: تشغيل Socket.IO على نفس السيرفر
    initSocket(server);

    // الخطوة 5: تشغيل السيرفر
    server.listen(PORT, () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

  } catch (err) {
    // لو أي حاجة فشلت — وقّف المشروع كله
    // process.exit(1) = خروج بكود خطأ
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};

// ابدأ السيرفر
startServer();