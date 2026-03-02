import { create } from 'zustand';
import api from '@/services/api';
import type { BotConfiguration } from '@/types';

interface ConfigState {
  configurations: BotConfiguration[];
  activeConfig: BotConfiguration | null;
  isLoading: boolean;
  fetchConfigurations: () => Promise<void>;
  fetchActiveConfig: () => Promise<void>;
  createConfiguration: (data: Partial<BotConfiguration>) => Promise<void>;
  updateConfiguration: (id: string, data: Partial<BotConfiguration>) => Promise<void>;
  activateConfiguration: (id: string) => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  configurations: [],
  activeConfig: null,
  isLoading: false,

  fetchConfigurations: async () => {
    set({ isLoading: true });
    try {
      const configs = await api.getConfigurations();
      set({ configurations: configs, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchActiveConfig: async () => {
    try {
      const config = await api.getActiveConfiguration();
      set({ activeConfig: config });
    } catch (error) {
      // No active config is OK
    }
  },

  createConfiguration: async (data) => {
    const newConfig = await api.createConfiguration(data);
    set((state) => ({
      configurations: [newConfig, ...state.configurations],
      activeConfig: newConfig.isActive ? newConfig : state.activeConfig,
    }));
  },

  updateConfiguration: async (id, data) => {
    const updated = await api.updateConfiguration(id, data);
    set((state) => ({
      configurations: state.configurations.map((c) => (c.id === id ? updated : c)),
      activeConfig: state.activeConfig?.id === id ? updated : state.activeConfig,
    }));
  },

  activateConfiguration: async (id) => {
    await api.activateConfiguration(id);
    await get().fetchConfigurations();
    await get().fetchActiveConfig();
  },
}));
