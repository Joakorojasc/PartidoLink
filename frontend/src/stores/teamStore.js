import { create } from 'zustand'
import api from '../api/client'

const useTeamStore = create((set) => ({
  myTeams: [],
  currentTeam: null,
  loading: false,

  fetchTeam: async (id) => {
    set({ loading: true })
    try {
      const res = await api.get(`/teams/${id}`)
      set({ currentTeam: res.data, loading: false })
      return res.data
    } catch {
      set({ loading: false })
    }
  },

  fetchTeams: async (filters = {}) => {
    set({ loading: true })
    try {
      const res = await api.get('/teams', { params: filters })
      set({ myTeams: res.data, loading: false })
      return res.data
    } catch {
      set({ loading: false })
    }
  },

  createTeam: async (data) => {
    const res = await api.post('/teams', { team: data })
    return res.data
  },

  joinTeam: async (id) => {
    const res = await api.post(`/teams/${id}/join`)
    return res.data
  },
}))

export default useTeamStore
