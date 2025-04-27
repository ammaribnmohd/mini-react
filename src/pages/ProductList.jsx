import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  const fetchProducts = async () => {
    setLoading(true); 
    setError(null);   
    try {
      const res = await axios.get('https://admin.refabry.com/api/all/product/get');
      if (res.data && res.data.data && Array.isArray(res.data.data.data)) {
        setProducts(res.data.data.data);
      } else {
        console.error('Unexpected API response structure:', res.data);
        setProducts([]); 
        setError('Failed to parse product data.');
      }
    } catch (err) {
      console.error('Fetching error:', err);
      setError('Failed to fetch products. Please try again later.'); //Error message
      setProducts([]);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading products...</p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
      </div>
    );
  }

  // --- Render No Products State ---
  if (!products.length) {
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
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col hover:shadow-lg transition duration-300 h-full" >
           
            <img
              src={product.image ? `https://admin.refabry.com/storage/product/${product.image}` : 'https://via.placeholder.com/300x200?text=No+Image'} // Fallback image
              alt={product.name || 'Product Image'} // Fallback alt text
              className="w-full h-52 object-cover rounded-xl mb-4"
              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x200?text=Image+Error"; }} 
            />

            {/* Product Info - flex-grow allows this section to expand */}
            <div className="flex flex-col flex-grow mb-4">
              <div className="text-lg font-semibold mb-1 line-clamp-2">{product.name || 'Unnamed Product'}</div> 
              <div className="text-sm text-gray-500 mb-1">
                Category: {product.category?.name || 'N/A'}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Code: {product.code || 'N/A'}
              </div>

              {/* Price Section */}
              <div className="flex items-center justify-between my-2">
                <span className="text-xl font-bold text-green-600">
                  ৳{product.price != null ? product.price : 'N/A'} 
                </span>
                
                {product.discount_amount != null && product.discount_amount > 0 && (
                  <span className="text-sm text-red-500 line-through">
                    ৳{product.price} {/* Show original price */}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <div className="text-sm text-gray-700 line-clamp-3 mt-1 mb-3 flex-grow">
                {product.short_desc || 'No description available.'}
              </div>

              {/* Stock Info */}
              <div className="text-sm text-gray-600">
                Stock: {product.stock != null ? product.stock : 'N/A'} {/* Handle null stock */}
              </div>
            </div>

            <Link to={`/product/${product.id}`} className="mt-auto"> 
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