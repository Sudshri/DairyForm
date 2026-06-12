import apiClient from './apiClient';

export const productApi = {
  /** GET /products?page=1&per_page=15&category=milk&search=&sort_by=popular */
  list:   (params = {}) => apiClient.get('/products', { params }),

  /** GET /products/:id */
  get:    (id) => apiClient.get(`/products/${id}`),

  /** GET /products/featured */
  featured: () => apiClient.get('/products/featured'),

  /** GET /products/new-arrivals */
  newArrivals: () => apiClient.get('/products/new-arrivals'),

  /** GET /products/best-sellers */
  bestSellers: () => apiClient.get('/products/best-sellers'),

  /** GET /products/:id/related */
  related: (id) => apiClient.get(`/products/${id}/related`),

  /** GET /products/:id/reviews */
  reviews: (id, params = {}) => apiClient.get(`/products/${id}/reviews`, { params }),

  /** POST /products/:id/reviews */
  addReview: (id, data) => apiClient.post(`/products/${id}/reviews`, data),

  /** GET /products/search?q= */
  search: (q) => apiClient.get('/products/search', { params: { q } }),
};
