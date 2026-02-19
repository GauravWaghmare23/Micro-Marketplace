import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('adminUser') || 'null'),
  token: localStorage.getItem('adminToken'),
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('adminUser', JSON.stringify(user));
    localStorage.setItem('adminToken', token);
    set({ user, token, error: null });
  },

  logout: () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    set({ user: null, token: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

export const useUIStore = create((set) => ({
  isDarkMode: true,
  isSidebarOpen: true,
  toasts: [],

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now() }]
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
}));
