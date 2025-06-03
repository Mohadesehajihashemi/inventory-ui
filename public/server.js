const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// لاگ کردن برای دیباگ
app.use((req, res, next) => {
    console.log(`درخواست دریافت شد: ${req.method} ${req.url}`);
    next();
});

// تنظیم EJS به عنوان view engine
app.set('view engine', 'ejs');

// سرو کردن فایل‌های استاتیک (مثل styles.css) از پوشه public
app.use(express.static(path.join(__dirname, 'public')));

// برای پردازش داده‌های فرم
app.use(express.urlencoded({ extended: true }));

// مسیر برای رندر کردن index.ejs
app.get('/', (req, res) => {
    res.render('index');
});

// مسیر تست GET
app.get('/simple-test', (req, res) => {
    res.send('این یه تست ساده‌ست!');
});

// مسیر تست POST
app.post('/test', (req, res) => {
    console.log('درخواست POST به /test رسید:', req.body);
    res.send('تست موفقیت‌آمیز بود!');
});

// مسیر برای مدیریت فرم
app.post('/api/submit', (req, res) => {
    console.log('درخواست POST به /api/submit رسید:', req.body);
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).send('لطفاً همه فیلدها را پر کنید.');
    }
    res.render('result', { name, age }); // رندر کردن result.ejs با داده‌ها
});

// مدیریت خطاهای 404
app.use((req, res) => {
    res.status(404).send('صفحه پیدا نشد (404)');
});

// راه‌اندازی سرور
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});