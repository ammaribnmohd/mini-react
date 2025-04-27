import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-xl transition ${
      location.pathname === path
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 hover:bg-indigo-100'
    }`;

  return (
    <nav className="bg-white shadow-md p-4 flex justify-center space-x-4">
      <Link to="/" className={linkClass('/')}>
        🛍️ Product List
      </Link>
      <Link to="/place-order" className={linkClass('/place-order')}>
        📝 Place Order
      </Link>
    </nav>
  );
};

export default Navbar;
