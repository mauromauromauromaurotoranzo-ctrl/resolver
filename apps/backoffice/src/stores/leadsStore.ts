import { create } from 'zustand';
import api from '@/services/api';
import type { Lead, DashboardStats } from '@/types';

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  pagination: any;
  filters: {
    status?: string;
    industry?: string;
    assignedTo?: string;
  };
  fetchLeads: (params?: any) => Promise<void>;
  fetchLead: (id: string) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<LeadsState['filters']>) => void;
  selectLead: (lead: Lead | null) => void;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  selectedLead: null,
  stats: null,
  isLoading: false,
  pagination: null,
  filters: {},

  fetchLeads: async (params = {}) => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const response = await api.getLeads({ ...filters, ...params });
      set({ 
        leads: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchLead: async (id: string) => {
    set({ isLoading: true });
    try {
      const { lead } = await api.getLead(id);
      set({ selectedLead: lead, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateLead: async (id: string, data: Partial<Lead>) => {
    const updated = await api.updateLead(id, data);
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? updated : l)),
      selectedLead: state.selectedLead?.id === id ? updated : state.selectedLead,
    }));
  },

  fetchStats: async () => {
    const stats = await api.getStats();
    set({ stats });
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().fetchLeads();
  },

  selectLead: (lead) => set({ selectedLead: lead }),
}));
