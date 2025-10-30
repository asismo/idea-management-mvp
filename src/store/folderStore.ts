import { create } from 'zustand';
import { Folder } from '../types';

interface FolderStore {
  folders: Folder[];
  loading: boolean;
  error: string | null;
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getFolderById: (id: string) => Folder | undefined;
  mergeFolders: (sourceId: string, targetId: string, newDescription: string) => void;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  loading: false,
  error: null,

  setFolders: (folders) => set({ folders }),

  addFolder: (folder) =>
    set((state) => ({
      folders: [folder, ...state.folders],
    })),

  updateFolder: (id, updates) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      ),
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  getFolderById: (id) => {
    const { folders } = get();
    return folders.find((folder) => folder.id === id);
  },

  mergeFolders: (sourceId, targetId, newDescription) => {
    set((state) => {
      const sourceFolder = state.folders.find((f) => f.id === sourceId);
      const targetFolder = state.folders.find((f) => f.id === targetId);

      if (!sourceFolder || !targetFolder) return state;

      // Merge tags
      const mergedTags = Array.from(
        new Set([...sourceFolder.tags, ...targetFolder.tags])
      );

      return {
        folders: state.folders
          .filter((f) => f.id !== sourceId)
          .map((f) =>
            f.id === targetId
              ? {
                  ...f,
                  description: newDescription,
                  tags: mergedTags,
                  idea_count: f.idea_count + sourceFolder.idea_count,
                  updated_at: new Date().toISOString(),
                }
              : f
          ),
      };
    });
  },
}));
