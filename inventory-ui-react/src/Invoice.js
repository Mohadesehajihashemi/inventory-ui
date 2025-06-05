import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css'; // از همون استایل‌های قبلی استفاده می‌کنیم

function Invoice() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('خطایی در دریافت داده‌ها رخ داد: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const totalPrice = products.reduce((total, product) => total + product.price, 0);

  return (
    <div className="container">
      <h2>فاکتور کالاها</h2>
      {products.length === 0 ? (
        <p className="empty-message">هیچ کالایی برای فاکتور وجود ندارد.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px', textAlign: 'right' }}>نام کالا</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>قیمت (تومان)</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>توضیحات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{product.name}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{product.price.toLocaleString('fa-IR')}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{product.description || 'بدون توضیح'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 style={{ textAlign: 'left' }}>جمع کل: {totalPrice.toLocaleString('fa-IR')} تومان</h3>
        </>
      )}
    </div>
  );
}

export default Invoice;