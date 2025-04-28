import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProductList from './pages/ProductList';
import PlaceOrder from './pages/PlaceOrder';
import Navbar from './pages/Navbar';
import ProductDetail from './pages/ProductDetail'; 

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetail />} /> 
          <Route path="/place-order" element={<PlaceOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;