import apiClient from './apiClient';

export const orderApi = {
  /** GET /orders?page=1&per_page=10&status= */
  list: (params = {}) => apiClient.get('/orders', { params }),

  /** GET /orders/:id */
  get:  (id) => apiClient.get(`/orders/${id}`),

  /** POST /orders  — place new order */
  create: (data) => apiClient.post('/orders', data),

  /** PATCH /orders/:id/cancel */
  cancel: (id) => apiClient.patch(`/orders/${id}/cancel`),

  /** GET /orders/:id/track */
  track: (id) => apiClient.get(`/orders/${id}/track`),

  /** POST /orders/:id/reorder */
  reorder: (id) => apiClient.post(`/orders/${id}/reorder`),
};
