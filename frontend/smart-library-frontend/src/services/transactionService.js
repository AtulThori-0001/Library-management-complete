
import api from './api';

export const issueBook = (data) => api.post('/transactions/issue', data);
export const returnBook = (data) => api.post('/transactions/return', data);
export const getAllTransactions = (page = 0, size = 10) =>
  api.get(`/transactions?page=${page}&size=${size}`);
export const getTransactionById = (id) => api.get(`/transactions/${id}`);
export const getTransactionsByUser = (userId, page = 0, size = 10) =>
  api.get(`/transactions/user/${userId}?page=${page}&size=${size}`);
export const getActiveIssues = (page = 0, size = 10) =>
  api.get(`/transactions/active?page=${page}&size=${size}`);
export const getOverdueTransactions = () => api.get('/transactions/overdue');
export const getMyBooks = () => api.get('/transactions/my-books');
export const downloadReport = (type = 'all') =>
  api.get(`/transactions/report?type=${type}`, { responseType: 'blob' });
