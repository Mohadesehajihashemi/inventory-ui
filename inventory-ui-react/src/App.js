import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ProductList from './ProductList';
import Invoice from './Invoice';
import PeopleList from './PeopleList';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>مدیریت هوشمند موجودی من</h1>
          <p>به پروژه من خوش اومدید! این یه صفحه ساده با React هست.</p>
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/" style={{ margin: '0 10px', color: '#3182ce', textDecoration: 'none' }}>
              مدیریت کالاها
            </Link>
            <Link to="/invoice" style={{ margin: '0 10px', color: '#3182ce', textDecoration: 'none' }}>
              فاکتور کالاها
            </Link>
            <Link to="/people" style={{ margin: '0 10px', color: '#3182ce', textDecoration: 'none' }}>
              لیست افراد
            </Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/people" element={<PeopleList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;