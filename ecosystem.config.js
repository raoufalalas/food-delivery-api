// =============================================
// ecosystem.config.js — إعدادات PM2
// =============================================

module.exports = {
  apps: [
    {
      // اسم التطبيق في PM2
      name: 'food-delivery-api',
      
      // الملف اللي PM2 هيشغّله
      script: 'server.js',
      
      // عدد الـ instances
      // 'max' = استخدم كل الـ CPU cores المتاحة
      // لو السيرفر عنده 4 cores هيشغّل 4 instances
      instances: 'max',
      
      // Cluster mode = بيوزّع الـ requests على كل الـ instances
      // بيزوّد الأداء بشكل كبير
      exec_mode: 'cluster',
      
      // متغيرات البيئة للـ Development
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      
      // متغيرات البيئة للـ Production
      // بتشغّله بـ: pm2 start ecosystem.config.js --env production
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // ملفات الـ Logs
      error_file: 'logs/err.log',      // أخطاء فقط
      out_file:   'logs/out.log',      // output عادي
      log_file:   'logs/combined.log', // الاتنين مع بعض
      
      // إضافة التاريخ والوقت على كل سطر في الـ Logs
      time: true,
      
      // متابعة تغييرات الملفات؟ لا في Production
      watch: false,
      
      // لو استخدم أكتر من 1GB RAM — أعد التشغيل تلقائياً
      max_memory_restart: '1G'
    }
  ]
};