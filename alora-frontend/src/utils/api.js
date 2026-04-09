import { getIdToken } from '../firebase/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function apiRequest(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth) {
    let token = await getIdToken();
    if (!token && localStorage.getItem('alora_admin_logged_in') === 'true') {
      token = 'local-admin';
    }
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  if (response.headers.get('content-type')?.includes('text/csv')) {
    return response.blob();
  }

  return response.json();
}

// Public API
export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/api/products?${qs}`);
  },
  getProduct: (id) => apiRequest(`/api/products/${id}`),
  getCategories: () => apiRequest('/api/categories'),
  getReviews: (productId) => apiRequest(`/api/reviews/${productId}`),
  getSettings: () => apiRequest('/api/settings'),
  trackOrder: (orderId) => apiRequest(`/api/orders/track/${orderId}`),
  subscribe: (email) => apiRequest('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  submitEnquiry: (data) => apiRequest('/api/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  register: (data) => apiRequest('/api/customers/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Admin API
export const adminApi = {
  getDashboard: () => apiRequest('/api/admin/dashboard', { auth: true }),
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/products?${qs}`, { auth: true });
  },
  getProduct: (id) => apiRequest(`/api/admin/products/${id}`, { auth: true }),
  createProduct: (data) => apiRequest('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  }),
  importProducts: (rows) => apiRequest('/api/admin/products/import', {
    method: 'POST',
    body: JSON.stringify({ rows }),
    auth: true,
  }),
  updateProduct: (id, data) => apiRequest(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    auth: true,
  }),
  deleteProduct: (id) => apiRequest(`/api/admin/products/${id}`, {
    method: 'DELETE',
    auth: true,
  }),
  getOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/orders?${qs}`, { auth: true });
  },
  getOrder: (id) => apiRequest(`/api/admin/orders/${id}`, { auth: true }),
  updateOrderStatus: (id, data) => apiRequest(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    auth: true,
  }),
  exportOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/orders/export?${qs}`, { auth: true });
  },
  getCustomers: () => apiRequest('/api/admin/customers', { auth: true }),
  getCustomer: (id) => apiRequest(`/api/admin/customers/${id}`, { auth: true }),
  getPendingReviews: () => apiRequest('/api/admin/reviews/pending', { auth: true }),
  getReviews: () => apiRequest('/api/admin/reviews', { auth: true }),
  updateReview: (id, data) => apiRequest(`/api/admin/reviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    auth: true,
  }),
  createReview: (data) => apiRequest('/api/admin/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  }),
  getCategories: () => apiRequest('/api/admin/categories', { auth: true }),
  createCategory: (data) => apiRequest('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  }),
  updateCategory: (id, data) => apiRequest(`/api/admin/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    auth: true,
  }),
  deleteCategory: (id) => apiRequest(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    auth: true,
  }),
  getSettings: () => apiRequest('/api/admin/settings', { auth: true }),
  updateSettings: (data) => apiRequest('/api/admin/settings', {
    method: 'PATCH',
    body: JSON.stringify(data),
    auth: true,
  }),
  uploadImage: (formData) => apiRequest('/api/admin/upload', {
    method: 'POST',
    body: formData,
    auth: true,
    headers: {},
  }),
  getAdmins: () => apiRequest('/api/admin/admins', { auth: true }),
  addAdmin: (data) => apiRequest('/api/admin/admins', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  }),
  removeAdmin: (uid) => apiRequest(`/api/admin/admins/${uid}`, {
    method: 'DELETE',
    auth: true,
  }),
};
