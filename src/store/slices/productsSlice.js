
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://admin.refabry.com/api/all/product/get';
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        return response.data.data.data;
      } else {
        console.error('Unexpected API response structure:', response.data);
        return rejectWithValue('Failed to parse product data.');
      }
    } catch (error) {
      console.error('Fetching error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [], 
  status: 'idle', 
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Store fetched products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error occurred'; 
      });
  },
});


export default productsSlice.reducer;

// --- Selectors ---

export const selectProductsState = (state) => state.products;


export const selectAllProducts = (state) => state.products.items;


export const selectProductsStatus = (state) => state.products.status;


export const selectProductsError = (state) => state.products.error;


export const selectProductById = createSelector(
  [selectAllProducts, (state, productId) => productId], 
  (products, productId) => products.find(product => product.id === productId) 
);