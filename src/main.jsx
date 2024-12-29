import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import AddItems from './pages/AddItems';
import './index.css';
import Home from './pages/Home';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      <Router>
        <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} /> {/* Маршрут для главной страницы */}
          <Route path="tab1" element={<Tab1 />} />
          <Route path="tab2" element={<Tab2 />} />
          <Route path="add-items" element={<AddItems />} />
        </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  </React.StrictMode>
);
