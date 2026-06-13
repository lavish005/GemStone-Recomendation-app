import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  register: async (name, email, password, dob, placeOfBirth) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, dob, placeOfBirth });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateProfile: async (profileData) => {
    const token = get().token;
    if (!token) return { success: false };
    set({ loading: true });
    try {
      await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await get().loadUser();
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  },

  toggleWatchlist: async (gemstoneId) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await axios.post(`${API_URL}/auth/watchlist/${gemstoneId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set(state => ({ user: { ...state.user, watchlist: res.data } }));
    } catch (err) {
      console.error(err);
    }
  },

  toggleSaved: async (gemstoneId) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await axios.post(`${API_URL}/auth/save/${gemstoneId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set(state => ({ user: { ...state.user, savedGemstones: res.data } }));
    } catch (err) {
      console.error(err);
    }
  },

  addPurchase: async (gemstoneId) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await axios.post(`${API_URL}/auth/purchase/${gemstoneId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set(state => ({ user: { ...state.user, purchases: res.data } }));
    } catch (err) {
      console.error(err);
    }
  }
}));

export default useAuthStore;
