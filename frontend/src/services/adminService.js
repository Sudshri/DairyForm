/**
 * Admin Service — one common method per resource type.
 * Every admin page imports from here; never calls axios directly.
 */
import API from '@/constants/api';
import {
  apiGet, apiPost, apiPut, apiPatch,
  apiDelete, apiUpload,
} from './apiClient';

// ── Dashboard ──────────────────────────────────────────────────────────────
export const dashboardService = {
  stats: () => apiGet(API.ADMIN.DASHBOARD.STATS),
};

// ── Products ───────────────────────────────────────────────────────────────
export const productService = {
  list:         (p)       => apiGet(API.ADMIN.PRODUCTS.LIST, p),
  show:         (id)      => apiGet(API.ADMIN.PRODUCTS.SHOW(id)),
  create:       (data)    => apiPost(API.ADMIN.PRODUCTS.CREATE, data),
  update:       (id, d)   => apiPut(API.ADMIN.PRODUCTS.UPDATE(id), d),
  remove:       (id)      => apiDelete(API.ADMIN.PRODUCTS.DELETE(id)),
  uploadImages: (id, fd, prog) => apiUpload(API.ADMIN.PRODUCTS.UPLOAD_IMAGES(id), fd, prog),
  deleteImage:  (id, imgId) => apiDelete(API.ADMIN.PRODUCTS.DELETE_IMAGE(id, imgId)),
};

// ── Categories ─────────────────────────────────────────────────────────────
export const categoryService = {
  list:   (p)     => apiGet(API.ADMIN.CATEGORIES.LIST, p),
  show:   (id)    => apiGet(API.ADMIN.CATEGORIES.SHOW(id)),
  create: (data)  => apiPost(API.ADMIN.CATEGORIES.CREATE, data),
  update: (id, d) => apiPut(API.ADMIN.CATEGORIES.UPDATE(id), d),
  remove: (id)    => apiDelete(API.ADMIN.CATEGORIES.DELETE(id)),
};

// ── Variants ───────────────────────────────────────────────────────────────
export const variantService = {
  list:   (p)     => apiGet(API.ADMIN.VARIANTS.LIST, p),
  show:   (id)    => apiGet(API.ADMIN.VARIANTS.SHOW(id)),
  create: (data)  => apiPost(API.ADMIN.VARIANTS.CREATE, data),
  update: (id, d) => apiPut(API.ADMIN.VARIANTS.UPDATE(id), d),
  remove: (id)    => apiDelete(API.ADMIN.VARIANTS.DELETE(id)),
};

// ── Inventory ──────────────────────────────────────────────────────────────
export const inventoryService = {
  lowStock:  ()       => apiGet(API.ADMIN.INVENTORY.LOW_STOCK),
  update:    (id, d)  => apiPut(API.ADMIN.INVENTORY.UPDATE(id), d),
  restock:   (id, d)  => apiPost(API.ADMIN.INVENTORY.RESTOCK(id), d),
};

// ── Offers / Coupons ───────────────────────────────────────────────────────
export const offerService = {
  list:           (p)         => apiGet(API.ADMIN.OFFERS.LIST, p),
  show:           (id)        => apiGet(API.ADMIN.OFFERS.SHOW(id)),
  create:         (data)      => apiPost(API.ADMIN.OFFERS.CREATE, data),
  update:         (id, d)     => apiPut(API.ADMIN.OFFERS.UPDATE(id), d),
  remove:         (id)        => apiDelete(API.ADMIN.OFFERS.DELETE(id)),
  assignVariant:  (id, data)  => apiPost(API.ADMIN.OFFERS.ASSIGN_VARIANT(id), data),
  removeVariant:  (id, vId)   => apiDelete(API.ADMIN.OFFERS.REMOVE_VARIANT(id, vId)),
};

// ── Banners ────────────────────────────────────────────────────────────────
export const bannerService = {
  list:   (p)     => apiGet(API.ADMIN.BANNERS.LIST, p),
  show:   (id)    => apiGet(API.ADMIN.BANNERS.SHOW(id)),
  create: (data)  => apiPost(API.ADMIN.BANNERS.CREATE, data),
  update: (id, d) => apiPut(API.ADMIN.BANNERS.UPDATE(id), d),
  remove: (id)    => apiDelete(API.ADMIN.BANNERS.DELETE(id)),
};

// ── Orders ─────────────────────────────────────────────────────────────────
export const orderService = {
  list:          (p)      => apiGet(API.ADMIN.ORDERS.LIST, p),
  show:          (id)     => apiGet(API.ADMIN.ORDERS.SHOW(id)),
  updateStatus:  (id, d)  => apiPatch(API.ADMIN.ORDERS.UPDATE_STATUS(id), d),
  addTracking:   (id, d)  => apiPost(API.ADMIN.ORDERS.ADD_TRACKING(id), d),
};

// ── Users ──────────────────────────────────────────────────────────────────
export const userService = {
  list:         (p)  => apiGet(API.ADMIN.USERS.LIST, p),
  show:         (id) => apiGet(API.ADMIN.USERS.SHOW(id)),
  toggleStatus: (id) => apiPatch(API.ADMIN.USERS.TOGGLE_STATUS(id)),
};

// ── Reviews ────────────────────────────────────────────────────────────────
export const reviewService = {
  list:    (p)  => apiGet(API.ADMIN.REVIEWS.LIST, p),
  approve: (id) => apiPatch(API.ADMIN.REVIEWS.APPROVE(id)),
  remove:  (id) => apiDelete(API.ADMIN.REVIEWS.DELETE(id)),
};

// ── Delivery Pincodes ──────────────────────────────────────────────────────
export const pincodeService = {
  list:   (p)     => apiGet(API.ADMIN.PINCODES.LIST, p),
  show:   (id)    => apiGet(API.ADMIN.PINCODES.SHOW(id)),
  create: (data)  => apiPost(API.ADMIN.PINCODES.CREATE, data),
  update: (id, d) => apiPut(API.ADMIN.PINCODES.UPDATE(id), d),
  remove: (id)    => apiDelete(API.ADMIN.PINCODES.DELETE(id)),
};
