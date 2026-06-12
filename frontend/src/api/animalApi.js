import apiClient from './apiClient';

export const animalApi = {
  list:    (params)     => apiClient.get('/animals', { params }),
  get:     (id)         => apiClient.get(`/animals/${id}`),
  create:  (data)       => apiClient.post('/animals', data),
  update:  (id, data)   => apiClient.put(`/animals/${id}`, data),
  remove:  (id)         => apiClient.delete(`/animals/${id}`),
  history: (id)         => apiClient.get(`/animals/${id}/history`),
};
