const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3001;

const dataFile = path.join(__dirname, 'data.json');
const productsFile = path.join(__dirname, 'products.json');

console.log('شروع سرور...');
console.log('مسیر فایل products.json:', productsFile);

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
}

if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify([]));
}

try {
    const products = JSON.parse(fs.readFileSync(productsFile));
    console.log('داده‌های اولیه products.json:', products);
} catch (error) {
    console.error('خطا در خواندن اولیه products.json:', error);
}

app.use(cors());
app.use((req, res, next) => {
    console.log(`درخواست دریافت شد: ${req.method} ${req.url}`);
    next();
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {
        error: null,
        firstName: '',
        lastName: '',
        nationalCode: '',
        phone: '',
        email: '',
        address: '',
        education: '',
        maritalStatus: '',
        gender: '',
        description: ''
    });
});

app.post('/api/submit', (req, res) => {
    console.log('درخواست POST به /api/submit رسید:', req.body);
    const {
        firstName,
        lastName,
        nationalCode,
        phone,
        email,
        address,
        education,
        maritalStatus,
        gender,
        description
    } = req.body;

    if (!firstName || !lastName || !nationalCode || !phone || !education || !maritalStatus || !gender) {
        return res.render('index', {
            error: 'لطفاً همه فیلدهای ضروری را پر کنید.',
            firstName: firstName || '',
            lastName: lastName || '',
            nationalCode: nationalCode || '',
            phone: phone || '',
            email: email || '',
            address: address || '',
            education: education || '',
            maritalStatus: maritalStatus || '',
            gender: gender || '',
            description: description || ''
        });
    }

    if (!/^\d{10}$/.test(nationalCode)) {
        return res.render('index', {
            error: 'کد ملی باید 10 رقم باشد.',
            firstName,
            lastName,
            nationalCode,
            phone,
            email: email || '',
            address: address || '',
            education,
            maritalStatus,
            gender,
            description: description || ''
        });
    }

    if (!/^09\d{9}$/.test(phone)) {
        return res.render('index', {
            error: 'شماره تماس باید 11 رقم باشد و با 09 شروع شود.',
            firstName,
            lastName,
            nationalCode,
            phone,
            email: email || '',
            address: address || '',
            education,
            maritalStatus,
            gender,
            description: description || ''
        });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.render('index', {
            error: 'ایمیل معتبر نیست.',
            firstName,
            lastName,
            nationalCode,
            phone,
            email,
            address: address || '',
            education,
            maritalStatus,
            gender,
            description: description || ''
        });
    }

    const data = JSON.parse(fs.readFileSync(dataFile));
    const newUser = {
        firstName,
        lastName,
        nationalCode,
        phone,
        email: email || '',
        address: address || '',
        education,
        maritalStatus,
        gender,
        description: description || ''
    };
    data.push(newUser);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.render('result', newUser);
});

app.get('/list', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile));
    res.render('list', { data });
});

app.get('/api/people', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataFile));
        console.log('داده‌های افراد:', data);
        res.json(data);
    } catch (error) {
        console.error('خطا در خواندن فایل data.json:', error);
        res.status(500).json({ error: 'خطایی در سرور رخ داد.' });
    }
});

app.post('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index);
    try {
        const data = JSON.parse(fs.readFileSync(dataFile));
        if (index >= 0 && index < data.length) {
            data.splice(index, 1);
            fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'فرد پیدا نشد.' });
        }
    } catch (error) {
        console.error('خطا در حذف فرد:', error);
        res.status(500).json({ error: 'خطایی در سرور رخ داد.' });
    }
});

app.get('/products', (req, res) => {
    const search = req.query.search || '';
    const editIndex = req.query.editIndex ? parseInt(req.query.editIndex) : undefined;
    const allProducts = JSON.parse(fs.readFileSync(productsFile));
    let products = allProducts.map((product, index) => ({
        ...product,
        originalIndex: index
    }));
    if (search) {
        products = products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    res.render('products', { products, search, editIndex });
});

app.get('/api/products', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsFile));
        console.log('داده‌ها از products.json:', products);
        res.json(products);
    } catch (error) {
        console.error('خطا در خواندن فایل products.json:', error);
        res.status(500).json({ error: 'خطایی در سرور رخ داد.' });
    }
});

app.post('/api/add-product', (req, res) => {
    const { name, price, description } = req.body;
    const priceNum = parseFloat(price);

    if (!name || isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'نام کالا و قیمت معتبر وارد کنید.' });
    }

    try {
        const products = JSON.parse(fs.readFileSync(productsFile));
        products.push({ name, price: priceNum, description: description || '' });
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('خطا در افزودن کالا:', error);
        res.status(500).json({ error: 'خطایی در سرور رخ داد.' });
    }
});

app.post('/edit-product/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const { name, price, description } = req.body;
    const priceNum = parseFloat(price);

    if (!name || isNaN(priceNum) || priceNum < 0) {
        const allProducts = JSON.parse(fs.readFileSync(productsFile));
        const products = allProducts.map((product, i) => ({
            ...product,
            originalIndex: i
        }));
        return res.status(400).json({ error: 'نام کالا و قیمت معتبر وارد کنید.' });
    }

    const products = JSON.parse(fs.readFileSync(productsFile));
    if (index >= 0 && index < products.length) {
        products[index] = { name, price: priceNum, description: description || '' };
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        console.log('داده‌ها ذخیره شدند:', products);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'کالا پیدا نشد.' });
    }
});

app.post('/delete-product/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const products = JSON.parse(fs.readFileSync(productsFile));
    if (index >= 0 && index < products.length) {
        products.splice(index, 1);
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'کالا پیدا نشد.' });
    }
});

app.get('/invoice', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFile));
    res.render('invoice', { products });
});

app.use((req, res) => {
    res.status(404).send('صفحه پیدا نشد (404)');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});