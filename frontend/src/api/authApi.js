import apiClient from './apiClient';

export const authApi = {
  login:    (data)  => apiClient.post('/auth/login', data),
  register: (data)  => apiClient.post('/auth/register', data),
  logout:   ()      => apiClient.post('/auth/logout'),
  refresh:  ()      => apiClient.post('/auth/refresh'),
  me:       ()      => apiClient.get('/auth/me'),
};
