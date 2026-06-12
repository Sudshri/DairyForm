import apiClient from './apiClient';

export const milkApi = {
  list:           (params) => apiClient.get('/milk-productions', { params }),
  create:         (data)   => apiClient.post('/milk-productions', data),
  update:         (id, d)  => apiClient.put(`/milk-productions/${id}`, d),
  remove:         (id)     => apiClient.delete(`/milk-productions/${id}`),
  dailySummary:   (params) => apiClient.get('/milk-productions/summary/daily', { params }),
  monthlySummary: (params) => apiClient.get('/milk-productions/summary/monthly', { params }),
};
