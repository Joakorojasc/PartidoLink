import { create } from 'zustand'
import api from '../api/client'

const useMatchStore = create((set) => ({
  openMatches: [],
  currentMatch: null,
  loading: false,

  fetchOpenMatches: async (filters = {}) => {
    set({ loading: true })
    try {
      const res = await api.get('/matches', { params: filters })
      set({ openMatches: res.data, loading: false })
      return res.data
    } catch {
      set({ loading: false })
    }
  },

  fetchMatch: async (id) => {
    set({ loading: true })
    try {
      const res = await api.get(`/matches/${id}`)
      set({ currentMatch: res.data, loading: false })
      return res.data
    } catch {
      set({ loading: false })
    }
  },

  submitResult: async (matchId, data) => {
    const res = await api.post(`/matches/${matchId}/results`, { match_result: data })
    return res.data
  },

  acceptResult: async (matchId, resultId) => {
    const res = await api.patch(`/matches/${matchId}/results/${resultId}/accept`)
    return res.data
  },

  rejectResult: async (matchId, resultId) => {
    const res = await api.patch(`/matches/${matchId}/results/${resultId}/reject`)
    return res.data
  },
}))

export default useMatchStore
