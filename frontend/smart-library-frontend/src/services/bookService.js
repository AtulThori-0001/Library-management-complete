
import api from './api';

export const getAllBooks = (page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') =>
  api.get(`/books?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
export const searchBooks = (keyword, page = 0, size = 10) =>
  api.get(`/books/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
export const getBookById = (id) => api.get(`/books/${id}`);
export const getBookByIsbn = (isbn) => api.get(`/books/isbn/${isbn}`);
export const getAllCategories = () => api.get('/books/categories');
export const getBooksByCategory = (cat, page = 0, size = 10) =>
  api.get(`/books/category/${encodeURIComponent(cat)}?page=${page}&size=${size}`);
export const getRecentBooks = (limit = 10) => api.get(`/books/recent?limit=${limit}`);
export const addBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
