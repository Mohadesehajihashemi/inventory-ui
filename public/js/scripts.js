// مدیریت فرم ثبت‌نام
const userForm = document.getElementById('userForm');
if (userForm) {
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const country = document.getElementById('userCountry').value;
    const gender = document.querySelector('input[name="gender"]:checked');

    if (!name) {
      document.getElementById('userNameError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('userNameError').style.display = 'none';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('userEmailError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('userEmailError').style.display = 'none';
    }

    if (!gender) {
      document.getElementById('genderError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('genderError').style.display = 'none';
    }

    if (!country) {
      document.getElementById('userCountryError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('userCountryError').style.display = 'none';
    }

    if (isValid) {
      const formData = new FormData(userForm);
      const userData = Object.fromEntries(formData);
      userData.interests = formData.getAll('interests');
      console.log('داده‌های کاربر:', userData);
      alert('ثبت‌نام با موفقیت انجام شد!');
      userForm.reset();
    }
  });
}

// مدیریت کالاها
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination');
let products = JSON.parse(localStorage.getItem('inventory')) || [];
let currentPage = 1;
const itemsPerPage = 5;

if (productForm) {
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const desc = document.getElementById('productDesc').value.trim();

    let isValid = true;
    if (!name) {
      document.getElementById('productNameError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('productNameError').style.display = 'none';
    }

    if (isNaN(price) || price < 0) {
      document.getElementById('productPriceError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('productPriceError').style.display = 'none';
    }

    if (isValid) {
      products.push({ name, price, desc });
      saveInventory();
      renderProducts();
      productForm.reset();
    }
  });
}

function saveInventory() {
  localStorage.setItem('inventory', JSON.stringify(products));
}

function renderProducts(filter = '') {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, start + itemsPerPage);

  productList.innerHTML = paginatedProducts.length
    ? ''
    : '<div class="empty-message">هیچ کالایی یافت نشد</div>';

  paginatedProducts.forEach((product, index) => {
    const productElement = document.createElement('div');
    productElement.className = 'product-item';
    productElement.innerHTML = `
      <div>
        <strong>${product.name}</strong> - ${product.price.toLocaleString('fa-IR')} تومان
        <br><small>${product.desc || 'بدون توضیح'}</small>
      </div>
      <button class="danger" onclick="removeProduct(${start + index})">حذف</button>
    `;
    productList.appendChild(productElement);
  });

  renderPagination(filteredProducts.length);
}

function removeProduct(index) {
  if (confirm('آیا از حذف این کالا مطمئن هستید؟')) {
    products.splice(index, 1);
    saveInventory();
    renderProducts(searchInput.value.trim());
  }
}

function renderPagination(totalItems) {
  pagination.innerHTML = '';
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  if (pageCount <= 1) return;

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.addEventListener('click', () => {
      currentPage = i;
      renderProducts(searchInput.value.trim());
    });
    pagination.appendChild(button);
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentPage = 1;
    renderProducts(e.target.value.trim());
  });
}

if (productList) {
  renderProducts();
}