import { create } from 'zustand';
import { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

interface SettingsStore {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  setSettings: (settings: Settings) => void;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  getSetting: <K extends keyof Settings>(key: K) => Settings[K] | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  setSettings: (settings) => set({ settings }),

  updateSetting: (key, value) =>
    set((state) => ({
      settings: state.settings
        ? {
            ...state.settings,
            [key]: value,
            updated_at: new Date().toISOString(),
          }
        : null,
    })),

  getSetting: (key) => {
    const { settings } = get();
    return settings ? settings[key] : undefined;
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  resetSettings: () =>
    set({
      settings: {
        session_id: '',
        ...DEFAULT_SETTINGS,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }),
}));
