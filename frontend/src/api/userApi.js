import apiClient from './apiClient';

export const userApi = {
  /** GET /user/profile */
  profile: () => apiClient.get('/user/profile'),

  /** PUT /user/profile */
  updateProfile: (data) => apiClient.put('/user/profile', data),

  /** PUT /user/password */
  changePassword: (data) => apiClient.put('/user/password', data),

  /** GET /user/addresses */
  addresses: () => apiClient.get('/user/addresses'),

  /** POST /user/addresses */
  addAddress: (data) => apiClient.post('/user/addresses', data),

  /** PUT /user/addresses/:id */
  updateAddress: (id, data) => apiClient.put(`/user/addresses/${id}`, data),

  /** DELETE /user/addresses/:id */
  deleteAddress: (id) => apiClient.delete(`/user/addresses/${id}`),

  /** PUT /user/addresses/:id/default */
  setDefaultAddress: (id) => apiClient.put(`/user/addresses/${id}/default`),

  /** GET /user/notifications */
  notifications: () => apiClient.get('/user/notifications'),

  /** PUT /user/notifications/read-all */
  markAllRead: () => apiClient.put('/user/notifications/read-all'),
};
