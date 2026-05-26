
import api from './api';

export const getAllStudents = (page = 0, size = 10, keyword = '') =>
  api.get(`/users/students?page=${page}&size=${size}${keyword ? '&keyword=' + encodeURIComponent(keyword) : ''}`);
export const getStudentById = (id) => api.get(`/users/students/${id}`);
export const updateStudent = (id, data) => api.put(`/users/students/${id}`, data);
export const deactivateStudent = (id) => api.put(`/users/students/${id}/deactivate`);
export const activateStudent = (id) => api.put(`/users/students/${id}/activate`);
export const getMyProfile = () => api.get('/users/profile');
export const updateMyProfile = (data) => api.put('/users/profile', data);
export const changePassword = (data) => api.put('/users/change-password', data);
