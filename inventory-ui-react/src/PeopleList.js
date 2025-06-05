import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

function PeopleList() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = () => {
    setLoading(true);
    axios.get('http://localhost:3001/api/people')
      .then(response => {
        console.log('داده‌های افراد دریافت شدند:', response.data);
        setPeople(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('خطا در دریافت داده‌ها:', err.message);
        setError('خطایی در دریافت داده‌ها رخ داد: ' + err.message);
        setLoading(false);
      });
  };

  const handleDelete = (index) => {
    axios.post(`http://localhost:3001/delete/${index}`)
      .then(() => {
        setError(null); // خطا رو پاک کن
        fetchPeople();
      })
      .catch(err => {
        setError(err.response?.data?.error || 'خطایی در حذف فرد رخ داد.');
      });
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2>لیست افراد</h2>
      <button
        onClick={fetchPeople}
        className="primary"
        style={{ marginBottom: '20px' }}
      >
        به‌روزرسانی لیست
      </button>
      {people.length === 0 ? (
        <p className="empty-message">هیچ فردی وجود ندارد.</p>
      ) : (
        people.map((person, index) => (
          <div key={index} className="product-item">
            <div>
              <strong>{person.firstName} {person.lastName}</strong>
              <br />
              <small>کد ملی: {person.nationalCode}</small>
              <br />
              <small>شماره تماس: {person.phone}</small>
            </div>
            <div className="button-group">
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

export default PeopleList;