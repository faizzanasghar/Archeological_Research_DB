import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  theme: localStorage.getItem('theme') || 'light',

  login: (token, userData) => {
    localStorage.setItem('token', token);
    set({
      token,
      user: userData,
      isAuthenticated: true
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      token: null,
      user: null,
      isAuthenticated: false
    });
  },

  toggleTheme: () => {
    const isLight = document.documentElement.classList.toggle('light');
    const newTheme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },

  initAuth: () => {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          set({ token: null, user: null, isAuthenticated: false });
        } else {
          set({
            token,
            user: {
              id: decoded.sub,
              username: decoded.username,
              role: decoded.role,
              accessiblePages: decoded.accessiblePages || []
            },
            isAuthenticated: true
          });
        }
      } catch (e) {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      }
    }
  }
}));
