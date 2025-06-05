import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [search, products]);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost:3001/api/products')
      .then(response => {
        console.log('داده‌ها دریافت شدند:', response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('خطا در دریافت داده‌ها:', err.message);
        console.error('جزئیات خطا:', err);
        setError('خطایی در دریافت داده‌ها رخ داد: ' + err.message);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || price < 0) {
      setError('لطفاً نام کالا و قیمت معتبر وارد کنید.');
      return;
    }

    const newProduct = {
      name,
      price: parseFloat(price),
      description: description || ''
    };

    axios.post('http://localhost:3001/api/add-product', newProduct)
      .then(() => {
        setName('');
        setPrice('');
        setDescription('');
        setError(null); // خطا رو پاک کن
        fetchProducts();
      })
      .catch(err => {
        setError(err.response?.data?.error || 'خطایی در افزودن کالا رخ داد.');
      });
  };

  const handleDelete = (index) => {
    axios.post(`http://localhost:3001/delete-product/${index}`)
      .then(() => {
        fetchProducts();
      })
      .catch(err => {
        setError('خطایی در حذف کالا رخ داد.');
      });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const product = products[index];
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditDescription(product.description || '');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName || !editPrice || editPrice < 0) {
      alert('لطفاً نام کالا و قیمت معتبر وارد کنید.');
      return;
    }

    const updatedProduct = {
      name: editName,
      price: parseFloat(editPrice),
      description: editDescription || ''
    };

    axios.post(`http://localhost:3001/edit-product/${editIndex}`, updatedProduct)
      .then(() => {
        setEditIndex(null);
        setEditName('');
        setEditPrice('');
        setEditDescription('');
        fetchProducts();
      })
      .catch(err => {
        setError('خطایی در ویرایش کالا رخ داد.');
      });
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditName('');
    setEditPrice('');
    setEditDescription('');
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2>افزودن کالا</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>نام کالا:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>قیمت (تومان):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            required
          />
        </div>
        <div className="field">
          <label>توضیحات:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="primary">
          افزودن کالا
        </button>
      </form>

      {editIndex !== null && (
        <div>
          <h2>ویرایش کالا</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="field">
              <label>نام کالا:</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>قیمت (تومان):</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="field">
              <label>توضیحات:</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="primary">
                ذخیره تغییرات
              </button>
              <button type="button" onClick={handleCancelEdit} className="secondary">
                لغو
              </button>
            </div>
          </form>
        </div>
      )}

      <h2>لیست کالاها</h2>
      <div className="field">
        <label>جستجوی کالا:</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="نام کالا را وارد کنید..."
        />
      </div>
      {filteredProducts.length === 0 ? (
        search ? (
          <p className="empty-message">هیچ کالایی با نام "{search}" یافت نشد.</p>
        ) : (
          <p className="empty-message">هیچ کالایی وجود ندارد.</p>
        )
      ) : (
        filteredProducts.map((product, index) => (
          <div key={index} className="product-item">
            <div>
              <strong>{product.name}</strong> - {product.price.toLocaleString('fa-IR')} تومان
              <br />
              <small>{product.description || 'بدون توضیح'}</small>
            </div>
            <div className="button-group">
              <button onClick={() => handleEdit(index)} className="primary">
                ویرایش
              </button>
              <button onClick={() => handleDelete(index)} className="danger">
                حذف
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductList;