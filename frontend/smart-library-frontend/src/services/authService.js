
import api from './api';

export const login = (data) => api.post('/auth/login', data);
export const registerStudent = (data) => api.post('/auth/register/student', data);
export const registerAdmin = (data) => api.post('/auth/register/admin', data);
export const getCurrentUser = () => api.get('/auth/me');
