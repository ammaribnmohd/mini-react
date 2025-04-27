import React, { useState } from 'react';
import axios from 'axios';

const PlaceOrder = () => {
  const [orderData, setOrderData] = useState({
    product_ids: '',
    s_product_qty: '',
    c_phone: '',
    c_name: '',
    courier: 'steadfast', 
    address: '',
    advance: null, 
    cod_amount: '',
    discount_amount: null, 
    delivery_charge: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle submission status
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' }); // State for success/error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitStatus({ message: '', type: '' });
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setSubmitStatus({ message: '', type: '' }); 

    if (!orderData.product_ids || !orderData.s_product_qty || !orderData.c_name || !orderData.c_phone || !orderData.address || !orderData.cod_amount || !orderData.delivery_charge) {
        setSubmitStatus({ message: 'Please fill in all required fields.', type: 'error' });
        setIsSubmitting(false);
        return; 
    }

    // Prepare data for API
    const payload = {
        ...orderData,
        advance: orderData.advance ? Number(orderData.advance) : null,
        cod_amount: Number(orderData.cod_amount),
        discount_amount: orderData.discount_amount ? Number(orderData.discount_amount) : null,
        delivery_charge: Number(orderData.delivery_charge),
        product_ids: String(orderData.product_ids),
        s_product_qty: String(orderData.s_product_qty),
    };


    try {
      const res = await axios.post(
        'https://admin.refabry.com/api/public/order/create',
        payload, // Send the prepared payload
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Order Response:', res.data);
      setSubmitStatus({ message: 'Order placed successfully!', type: 'success' });
    
    } catch (error) {
      console.error('Order failed:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Order failed! Please check details and try again.';
      setSubmitStatus({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false); 
    }
  };

   const fields = [
     { name: 'product_ids', label: 'Product IDs (comma separated)', type: 'text', required: true },
     { name: 's_product_qty', label: 'Quantities (comma separated)', type: 'text', required: true },
     { name: 'c_name', label: 'Customer Name', type: 'text', required: true },
     { name: 'c_phone', label: 'Phone Number', type: 'tel', required: true }, 
     { name: 'address', label: 'Delivery Address', type: 'text', required: true },
     { name: 'cod_amount', label: 'COD Amount', type: 'number', required: true },
     { name: 'delivery_charge', label: 'Delivery Charge', type: 'number', required: true },
     { name: 'advance', label: 'Advance Payment (Optional)', type: 'number', required: false },
     { name: 'discount_amount', label: 'Discount Amount (Optional)', type: 'number', required: false },
   ];

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8 mt-10 dark:bg-gray-800">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Place Your Order
      </h2>

      {submitStatus.message && (
        <div
          className={`mb-4 p-3 rounded-lg text-center ${
            submitStatus.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type} 
              id={field.name}   
              name={field.name}
              value={orderData[field.name] ?? ''} 
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              required={field.required}
              placeholder={field.label.includes('Optional') ? '' : field.label} 
              step={field.type === 'number' ? '0.01' : undefined} 
            />
          </div>
        ))}

        <div>
          <label
             htmlFor="courier"
             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Courier <span className="text-red-500">*</span>
          </label>
          <select
            id="courier"
            name="courier"
            value={orderData.courier}
            onChange={handleChange}
            required 
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="steadfast">Steadfast</option>
            <option value="pathao">Pathao</option>
            <option value="e-courier">E-Courier</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;