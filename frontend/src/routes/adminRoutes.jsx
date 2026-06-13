import { lazy } from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '@/admin/layout/AdminLayout';
import AdminGuard  from './AdminGuard';

// Lazy-load every admin page
const AdminLogin   = lazy(() => import('@/pages/admin/AdminLogin'));
const Dashboard    = lazy(() => import('@/admin/pages/Dashboard'));
const ProductList  = lazy(() => import('@/admin/pages/products/ProductList'));
const ProductForm  = lazy(() => import('@/admin/pages/products/ProductForm'));
const CategoryList = lazy(() => import('@/admin/pages/categories/CategoryList'));
const InventoryList= lazy(() => import('@/admin/pages/inventory/InventoryList'));
const BannerList   = lazy(() => import('@/admin/pages/banners/BannerList'));
const CouponList   = lazy(() => import('@/admin/pages/coupons/CouponList'));
const OrderList    = lazy(() => import('@/admin/pages/orders/OrderList'));
const OrderDetail  = lazy(() => import('@/admin/pages/orders/OrderDetail'));
const UserList     = lazy(() => import('@/admin/pages/users/UserList'));

/**
 * Returns a <Route path="/admin"> tree.
 * Wrap in <Suspense> at the consumer.
 */
export default function AdminRoutes() {
  return (
    <>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin"
      element={
        <AdminGuard>
          <AdminLayout />
        </AdminGuard>
      }
    >
      <Route index               element={<Dashboard />} />

      {/* Products */}
      <Route path="products"        element={<ProductList />} />
      <Route path="products/new"    element={<ProductForm />} />
      <Route path="products/:id/edit" element={<ProductForm />} />

      {/* Categories */}
      <Route path="categories"      element={<CategoryList />} />

      {/* Inventory */}
      <Route path="inventory"       element={<InventoryList />} />

      {/* Banners */}
      <Route path="banners"         element={<BannerList />} />

      {/* Coupons */}
      <Route path="coupons"         element={<CouponList />} />

      {/* Orders */}
      <Route path="orders"          element={<OrderList />} />
      <Route path="orders/:id"      element={<OrderDetail />} />

      {/* Users */}
      <Route path="users"           element={<UserList />} />
    </Route>
    </>
  );
}
