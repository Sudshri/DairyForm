import apiClient from './apiClient';

export const categoryApi = {
  /** GET /categories */
  list: () => apiClient.get('/categories'),

  /** GET /categories/:slug */
  get:  (slug) => apiClient.get(`/categories/${slug}`),

  /** GET /categories/:slug/products */
  products: (slug, params = {}) =>
    apiClient.get(`/categories/${slug}/products`, { params }),
};
