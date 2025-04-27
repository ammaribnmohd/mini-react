
import ProductList from './pages/ProductList'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PlaceOrder from './pages/PlaceOrder';
import Navbar from './pages/Navbar';
function App() {
  

  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/place-order" element={<PlaceOrder />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
