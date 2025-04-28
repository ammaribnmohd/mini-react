import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus, selectProductsError } from '../store/slices/productsSlice';

const ProductList = () => {
  const dispatch = useDispatch();

  // Get data from Redux store using selectors
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]); 

  // --- Render Loading State ---
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500 mr-4">Loading products...</p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // --- Render Error State ---
  if (status === 'failed') {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-xl text-red-500 bg-red-100 p-4 rounded-lg mb-4">Error: {error}</p>
        <button
            onClick={() => dispatch(fetchProducts())} // Allow retrying
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
            Retry Fetching
        </button>
      </div>
    );
  }

  if (status === 'succeeded' && !products.length) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>
        <p className="text-xl text-gray-500">No products found.</p>
      </div>
    );
  }

  // --- Render Product List ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 flex flex-col hover:shadow-lg transition duration-300 h-full" >

            <img
              src={product.image ? `https://admin.refabry.com/storage/product/${product.image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={product.name || 'Product Image'}
              className="w-full h-52 object-cover rounded-xl mb-4"
              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x200?text=Image+Error"; }}
            />

            <div className="flex flex-col flex-grow mb-4">
              <div className="text-lg font-semibold mb-1 line-clamp-2 dark:text-gray-100">{product.name || 'Unnamed Product'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Category: {product.category?.name || 'N/A'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Code: {product.code || 'N/A'}
              </div>

              <div className="flex items-center justify-between my-2">
                <span className="text-xl font-bold text-green-600">
                  ৳{product.price != null ? product.price : 'N/A'}
                </span>

                {product.discount_amount != null && product.discount_amount > 0 && (
                   <span className="text-sm text-red-500 line-through">
                       ৳{product.price + Number(product.discount_amount)} 
                   </span>
                )}
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mt-1 mb-3 flex-grow">
                {product.short_desc || 'No description available.'}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Stock: {product.stock != null ? product.stock : 'N/A'}
              </div>
            </div>

             {/* Use Link component for navigation */}
             <Link to={`/product/${product.id}`} className="mt-auto block w-full">
              <button className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;