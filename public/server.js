const express = require('express');
const app = express();
const port = 3000;

// تنظیم EJS به عنوان view engine
app.set('view engine', 'ejs');

// راه‌اندازی سرور
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
