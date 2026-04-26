import { create } from 'zustand'
import api from '../api/client'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/login', { user: { email, password } })
      const token = res.headers['authorization']?.replace('Bearer ', '') || res.data.token
      localStorage.setItem('token', token)
      set({ user: res.data.user, token, loading: false })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión'
      set({ error: msg, loading: false })
      return { success: false, error: msg }
    }
  },

  signup: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/signup', { user: data })
      set({ loading: false })
      return { success: true }
    } catch (err) {
      const errors = err.response?.data?.errors || ['Error al crear cuenta']
      set({ error: errors.join(', '), loading: false })
      return { success: false, errors }
    }
  },

  logout: async () => {
    try {
      await api.delete('/auth/logout')
    } catch {}
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    if (!get().token) return
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data })
    } catch {}
  },

  updateProfile: async (data) => {
    const userId = get().user?.id
    if (!userId) return
    const res = await api.patch(`/users/${userId}`, { user: data })
    set(state => ({ user: { ...state.user, ...res.data } }))
  },

  isAuthenticated: () => !!get().token,
}))

export default useAuthStore
