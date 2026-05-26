
import api from './api';

export const makeReservation = (data) => api.post('/reservations', data);
export const cancelReservation = (id) => api.put(`/reservations/${id}/cancel`);
export const fulfillReservation = (id) => api.put(`/reservations/${id}/fulfill`);
export const getAllReservations = (page = 0, size = 10) =>
  api.get(`/reservations?page=${page}&size=${size}`);
export const getMyReservations = (page = 0, size = 10) =>
  api.get(`/reservations/my?page=${page}&size=${size}`);
