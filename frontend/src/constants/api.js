/**
 * DairyForm — Centralised API Endpoint Constants
 * All endpoint strings live here. Components import from this file only.
 *
 * Dynamic endpoints are functions: API.ADMIN.PRODUCTS.SHOW(id)
 * Static  endpoints are strings:  API.AUTH.LOGIN
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

// Helper
const u  = (path) => `${BASE}${path}`;
const up = (path) => (id) => `${BASE}${path}/${id}`;

export const API = {
  BASE,

  // ── Authentication ───────────────────────────────────────────────────────
  AUTH: {
    LOGIN:           u('/auth/login'),
    REGISTER:        u('/auth/register'),
    LOGOUT:          u('/auth/logout'),
    REFRESH:         u('/auth/refresh'),
    SEND_OTP:        u('/auth/send-otp'),
    VERIFY_OTP:      u('/auth/verify-otp'),
    ME:              u('/auth/me'),
  },

  // ── Public Products ──────────────────────────────────────────────────────
  PRODUCTS: {
    LIST:            u('/products'),
    SEARCH:          u('/products/search'),
    FEATURED:        u('/products/featured'),
    TRENDING:        u('/products/trending'),
    SHOW:            (id) => u(`/products/${id}`),
    VARIANTS:        (id) => u(`/products/${id}/variants`),
    REVIEWS:         (id) => u(`/products/${id}/reviews`),
  },

  // ── Public Categories ────────────────────────────────────────────────────
  CATEGORIES: {
    LIST:            u('/categories'),
    SHOW:            (slug) => u(`/categories/${slug}`),
    PRODUCTS:        (slug) => u(`/categories/${slug}/products`),
  },

  // ── Cart ─────────────────────────────────────────────────────────────────
  CART: {
    GET:             u('/cart'),
    ADD:             u('/cart'),
    UPDATE:          (id) => u(`/cart/${id}`),
    REMOVE:          (id) => u(`/cart/${id}`),
    CLEAR:           u('/cart'),
    APPLY_COUPON:    u('/cart/apply-coupon'),
    REMOVE_COUPON:   u('/cart/remove-coupon'),
  },

  // ── Wishlist ─────────────────────────────────────────────────────────────
  WISHLIST: {
    GET:             u('/wishlist'),
    TOGGLE:          u('/wishlist'),
    REMOVE:          (id) => u(`/wishlist/${id}`),
    MOVE_TO_CART:    (id) => u(`/wishlist/${id}/move-to-cart`),
  },

  // ── Orders ───────────────────────────────────────────────────────────────
  ORDERS: {
    LIST:            u('/orders'),
    PLACE:           u('/orders'),
    SHOW:            (id) => u(`/orders/${id}`),
    TRACK:           (id) => u(`/orders/${id}/track`),
    CANCEL:          (id) => u(`/orders/${id}/cancel`),
    REORDER:         (id) => u(`/orders/${id}/reorder`),
  },

  // ── Payments ─────────────────────────────────────────────────────────────
  PAYMENTS: {
    CREATE_ORDER:    u('/payments/create-order'),
    VERIFY:          u('/payments/verify'),
    WEBHOOK:         u('/payments/webhook'),
  },

  // ── Delivery ─────────────────────────────────────────────────────────────
  DELIVERY: {
    CHECK_PINCODE:   (pin) => u(`/delivery/check-pincode/${pin}`),
  },

  // ── Profile & Addresses ──────────────────────────────────────────────────
  PROFILE: {
    GET:             u('/profile'),
    UPDATE:          u('/profile'),
    CHANGE_PASSWORD: u('/profile/change-password'),
    UPDATE_FCM:      u('/profile/update-fcm-token'),
  },
  ADDRESSES: {
    LIST:            u('/addresses'),
    CREATE:          u('/addresses'),
    UPDATE:          (id) => u(`/addresses/${id}`),
    DELETE:          (id) => u(`/addresses/${id}`),
    SET_DEFAULT:     (id) => u(`/addresses/${id}/set-default`),
  },

  // ── Reviews ──────────────────────────────────────────────────────────────
  REVIEWS: {
    CREATE:          u('/reviews'),
    UPDATE:          (id) => u(`/reviews/${id}`),
    DELETE:          (id) => u(`/reviews/${id}`),
    HELPFUL:         (id) => u(`/reviews/${id}/helpful`),
  },

  // ── Banners (public) ─────────────────────────────────────────────────────
  BANNERS: {
    LIST:            u('/banners'),
  },

  // ── ADMIN ────────────────────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: {
      STATS:           u('/admin/dashboard/stats'),
    },

    PRODUCTS: {
      LIST:            u('/admin/products'),
      CREATE:          u('/admin/products'),
      SHOW:            (id) => u(`/admin/products/${id}`),
      UPDATE:          (id) => u(`/admin/products/${id}`),
      DELETE:          (id) => u(`/admin/products/${id}`),
      UPLOAD_IMAGES:   (id) => u(`/admin/products/${id}/images`),
      DELETE_IMAGE:    (id, imgId) => u(`/admin/products/${id}/images/${imgId}`),
    },

    CATEGORIES: {
      LIST:            u('/admin/categories'),
      CREATE:          u('/admin/categories'),
      SHOW:            (id) => u(`/admin/categories/${id}`),
      UPDATE:          (id) => u(`/admin/categories/${id}`),
      DELETE:          (id) => u(`/admin/categories/${id}`),
    },

    VARIANTS: {
      LIST:            u('/admin/product-variants'),
      CREATE:          u('/admin/product-variants'),
      SHOW:            (id) => u(`/admin/product-variants/${id}`),
      UPDATE:          (id) => u(`/admin/product-variants/${id}`),
      DELETE:          (id) => u(`/admin/product-variants/${id}`),
    },

    INVENTORY: {
      UPDATE:          (id) => u(`/admin/inventory/${id}`),
      RESTOCK:         (id) => u(`/admin/inventory/${id}/restock`),
      LOW_STOCK:       u('/admin/inventory/low-stock'),
    },

    OFFERS: {
      LIST:            u('/admin/offers'),
      CREATE:          u('/admin/offers'),
      SHOW:            (id) => u(`/admin/offers/${id}`),
      UPDATE:          (id) => u(`/admin/offers/${id}`),
      DELETE:          (id) => u(`/admin/offers/${id}`),
      ASSIGN_VARIANT:  (id) => u(`/admin/offers/${id}/assign-variant`),
      REMOVE_VARIANT:  (id, vId) => u(`/admin/offers/${id}/remove-variant/${vId}`),
    },

    BANNERS: {
      LIST:            u('/admin/banners'),
      CREATE:          u('/admin/banners'),
      SHOW:            (id) => u(`/admin/banners/${id}`),
      UPDATE:          (id) => u(`/admin/banners/${id}`),
      DELETE:          (id) => u(`/admin/banners/${id}`),
    },

    PINCODES: {
      LIST:            u('/admin/delivery-pincodes'),
      CREATE:          u('/admin/delivery-pincodes'),
      SHOW:            (id) => u(`/admin/delivery-pincodes/${id}`),
      UPDATE:          (id) => u(`/admin/delivery-pincodes/${id}`),
      DELETE:          (id) => u(`/admin/delivery-pincodes/${id}`),
    },

    ORDERS: {
      LIST:            u('/admin/orders'),
      SHOW:            (id) => u(`/admin/orders/${id}`),
      UPDATE_STATUS:   (id) => u(`/admin/orders/${id}/status`),
      ADD_TRACKING:    (id) => u(`/admin/orders/${id}/add-tracking`),
    },

    USERS: {
      LIST:            u('/admin/users'),
      SHOW:            (id) => u(`/admin/users/${id}`),
      TOGGLE_STATUS:   (id) => u(`/admin/users/${id}/toggle-status`),
    },

    REVIEWS: {
      LIST:            u('/admin/reviews'),
      APPROVE:         (id) => u(`/admin/reviews/${id}/approve`),
      DELETE:          (id) => u(`/admin/reviews/${id}`),
    },
  },
};

export default API;
