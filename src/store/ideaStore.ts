import { create } from 'zustand';
import type { Idea } from '../types';

interface IdeaStore {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  setIdeas: (ideas: Idea[]) => void;
  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getIdeasByFolder: (folderId: string) => Idea[];
  searchIdeas: (query: string) => Idea[];
}

export const useIdeaStore = create<IdeaStore>((set, get) => ({
  ideas: [],
  loading: false,
  error: null,

  setIdeas: (ideas) => set({ ideas }),

  addIdea: (idea) =>
    set((state) => ({
      ideas: [idea, ...state.ideas],
    })),

  updateIdea: (id, updates) =>
    set((state) => ({
      ideas: state.ideas.map((idea) => (idea.id === id ? { ...idea, ...updates } : idea)),
    })),

  deleteIdea: (id) =>
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  getIdeasByFolder: (folderId) => {
    const { ideas } = get();
    return ideas.filter((idea) => idea.folder_id === folderId);
  },

  searchIdeas: (query) => {
    const { ideas } = get();
    const lowerQuery = query.toLowerCase();
    return ideas.filter(
      (idea) =>
        idea.content.toLowerCase().includes(lowerQuery) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
}));
