import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

// Customers
export const createCustomer = (data) => api.post('/customers', data).then(res => res.data);
export const getCustomer = (id) => api.get(`/customers/${id}`).then(res => res.data);
export const getAllCustomers = () => api.get('/customers').then(res => res.data);

// Products
export const getProducts = () => api.get('/products').then(res => res.data);
export const getProductById = (id) => api.get(`/products/${id}`).then(res => res.data);

// Cart
export const getCartByCustomer = (customerId) => api.get(`/carts/${customerId}`).then(res => res.data);
export const addOrUpdateCartItem = (customerId, payload) => api.post(`/carts/${customerId}/items`, payload).then(res => res.data);
export const removeCartItem = (customerId, productId) => api.delete(`/carts/${customerId}/items/${productId}`).then(res => res.data);
export const clearCart = (customerId) => api.delete(`/carts/${customerId}`).then(res => res.data);

// Orders
export const createOrder = (customerId, payload) => api.post(`/orders/${customerId}`, payload).then(res => res.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then(res => res.data);
export const getOrdersByCustomer = (customerId) => api.get(`/orders/customer/${customerId}`).then(res => res.data);

export default api;
