import api from './axios';

/**
 * Admin Auth API
 */
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return Promise.resolve();
  }
};

/**
 * Admin Users API
 */
export const usersAPI = {
  listUsers: (page = 1, limit = 20, q = '') =>
    api.get('/api/admin/users', {
      params: { page, limit, q }
    }),
  
  getUser: (id) =>
    api.get(`/api/admin/users/${id}`),
  
  deleteUser: (id) =>
    api.delete(`/api/admin/users/${id}`)
};

/**
 * Admin Products API
 */
export const productsAPI = {
  listProducts: (page = 1, limit = 20, q = '') =>
    api.get('/api/admin/products', {
      params: { page, limit, q }
    }),
  
  updateProduct: (id, data) =>
    api.put(`/api/admin/products/${id}`, data),
  
  deleteProduct: (id) =>
    api.delete(`/api/admin/products/${id}`)
};
