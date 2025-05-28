// محدثه‌ام، این سرور رو برای پروژه مدیریت کاربران و کالاها درست کردم
const express = require('express');
const app = express();
const port = 3000;

// تنظیمات برای گرفتن داده‌های فرم و دسترسی به فایل‌های HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// آرایه‌ها برای ذخیره داده‌ها
const users = [];
const products = [];

// مسیر GET برای صفحه اصلی
app.get('/', (req, res) => {
  res.send('این سرور پروژه مدیریت کاربران و کالاهاست');
});

// مسیر POST برای ثبت‌نام کاربر
app.post('/signup', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).send('نام و ایمیل اجباری است');
    return;
  }
  users.push({ name, email });
  res.send('کاربر ' + name + ' ثبت شد');
});

// مسیر POST برای اضافه کردن کالا
app.post('/add-product', (req, res) => {
  const { productName, productPrice, productDesc } = req.body;
  if (!productName || !productPrice) {
    res.status(400).send('نام کالا و قیمت اجباری است');
    return;
  }
  products.push({ name: productName, price: productPrice, desc: productDesc || 'بدون توضیح' });
  res.send('کالا ' + productName + ' اضافه شد');
});

// مسیر GET برای نمایش لیست کاربران
app.get('/users', (req, res) => {
  res.json(users);
});

// مسیر GET برای نمایش لیست کالاها
app.get('/products', (req, res) => {
  res.json(products);
});

// راه‌اندازی سرور روی پورت 3000
app.listen(port, () => {
  console.log('سرور روی پورت ' + port + ' اجرا شد');
})