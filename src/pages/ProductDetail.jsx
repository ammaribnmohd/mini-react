import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectProductById, selectProductsStatus, selectProductsError } from '../store/slices/productsSlice'; 

const ProductDetail = () => {
  const { productId } = useParams(); 
  const dispatch = useDispatch();

  const product = useSelector((state) => selectProductById(state, parseInt(productId))); 
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // --- Loading State ---
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500 mr-4">Loading product details...</p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // --- Error State ---
  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500 bg-red-100 p-4 rounded-lg">Error: {error}</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-6">Product Not Found</h1>
        <p className="text-xl text-gray-500 mb-6">Could not find the product you were looking for.</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Product List
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8 mt-10 dark:bg-gray-800">
      <div className="md:flex md:space-x-8">
        {/* Product Image */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img
            src={product.image ? `https://admin.refabry.com/storage/product/${product.image}` : 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={product.name || 'Product Image'}
            className="w-full h-auto object-cover rounded-xl shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Error"; }}
          />
          {product.product_images && product.product_images.length > 1 && (
             <div className="grid grid-cols-3 gap-2 mt-4">
               {product.product_images.map(img => (
                 <img
                   key={img.id}
                   src={`https://admin.refabry.com/storage/product/${img.name}`}
                   alt={`${product.name} - view ${img.id}`}
                   className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                 />
               ))}
             </div>
          )}
        </div>

        {/* Product Information */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">{product.name || 'Unnamed Product'}</h1>
          <div className="text-md text-gray-500 dark:text-gray-400 mb-4">
            Category: {product.category?.name || 'N/A'} | Code: {product.code || 'N/A'}
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3 my-4">
            <span className="text-3xl font-bold text-green-600">
              ৳{product.price != null ? product.price : 'N/A'}
            </span>
            {product.discount_amount != null && product.discount_amount > 0 && (
              <span className="text-lg text-red-500 line-through">
                 ৳{product.price + Number(product.discount_amount)} 
              </span>
            )}
          </div>
            {/* Discount Info */}
            {product.discount_amount != null && product.discount_amount > 0 && (
              <p className="text-sm text-yellow-600 mb-4">Save ৳{product.discount_amount}!</p>
            )}


          {/* Stock */}
          <div className="text-md font-semibold mb-4">
            Stock:
            <span className={`ml-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
             {product.short_desc || 'No description available.'}
          </p>

          {/* Back Button */}
          <div className="mt-8">
            <Link
              to="/"
              className="inline-block bg-gray-200 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-300 transition mr-4"
            >
              ← Back to List
            </Link>     
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;