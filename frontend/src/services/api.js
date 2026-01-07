import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error?.message || 'Something went wrong';
    
    // You can handle specific error codes here
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// API methods
export const shopifyApi = {
  // Products
  getProducts: (params) => api.get('/shopify/products', { params }),
  getProduct: (handle) => api.get(`/shopify/products/${handle}`),
  
};

export default api;
