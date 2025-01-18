import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:6000/api' });

export const fetchTransactions = () => API.get('/transactions');
export const createTransaction = (transaction) => API.post('/transactions', transaction);
export const fetchCategories = () => API.get('/categories');
export const createCategory = (category) => API.post('/categories', category);

export default API;
