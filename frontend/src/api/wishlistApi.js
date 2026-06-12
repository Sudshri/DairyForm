import apiClient from './apiClient';

export const wishlistApi = {
  /** GET /wishlist */
  list:   () => apiClient.get('/wishlist'),

  /** POST /wishlist  { product_id } */
  add:    (productId) => apiClient.post('/wishlist', { product_id: productId }),

  /** DELETE /wishlist/:productId */
  remove: (productId) => apiClient.delete(`/wishlist/${productId}`),

  /** POST /wishlist/:productId/move-to-cart */
  moveToCart: (productId) => apiClient.post(`/wishlist/${productId}/move-to-cart`),
};
