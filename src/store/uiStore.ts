import { create } from 'zustand';

interface UIStore {
  showOnboarding: boolean;
  showSettings: boolean;
  showHelp: boolean;
  selectedFolderId: string | null;
  searchQuery: string;
  theme: 'light' | 'dark' | 'system';
  setShowOnboarding: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  showOnboarding: false,
  showSettings: false,
  showHelp: false,
  selectedFolderId: null,
  searchQuery: '',
  theme: 'system',

  setShowOnboarding: (show) => set({ showOnboarding: show }),
  setShowSettings: (show) => set({ showSettings: show }),
  setShowHelp: (show) => set({ showHelp: show }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTheme: (theme) => set({ theme }),
}));
