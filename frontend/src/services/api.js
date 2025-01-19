import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: 'http://localhost:4000/api', // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories API calls
export const fetchCategories = () => API.get('/categories');
export const createCategory = (category) => API.post('/categories', category);
export const updateCategory = (id, category) => API.put(`/categories/${id}`, category);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Transactions API calls
export const fetchTransactions = () => API.get('/transactions');
export const createTransaction = (transaction) => API.post('/transactions', transaction);
export const updateTransaction = (id, transaction) => API.put(`/transactions/${id}`, transaction);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export default API;
