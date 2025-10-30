import { useCallback, useEffect } from 'react';
import { useIdeaStore } from '../store/ideaStore';
import type { Idea } from '../types';
import * as supabaseClient from '../services/supabaseClient';

export const useIdeas = () => {
  const { ideas, loading, error, setIdeas, addIdea, updateIdea, deleteIdea, setLoading, setError } =
    useIdeaStore();

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supabaseClient.getIdeas();
      setIdeas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ideas');
    } finally {
      setLoading(false);
    }
  }, [setIdeas, setLoading, setError]);

  const createIdea = useCallback(
    async (content: string, folderId: string, tags: string[]) => {
      try {
        const newIdea = await supabaseClient.createIdea(content, folderId, tags);
        addIdea(newIdea);
        return newIdea;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create idea');
        throw err;
      }
    },
    [addIdea, setError]
  );

  const updateIdeaData = useCallback(
    async (id: string, updates: Partial<Idea>) => {
      try {
        const updated = await supabaseClient.updateIdea(id, updates);
        updateIdea(id, updates);
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update idea');
        throw err;
      }
    },
    [updateIdea, setError]
  );

  const deleteIdeaData = useCallback(
    async (id: string) => {
      try {
        await supabaseClient.deleteIdea(id);
        deleteIdea(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete idea');
        throw err;
      }
    },
    [deleteIdea, setError]
  );

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    updateIdea: updateIdeaData,
    deleteIdea: deleteIdeaData,
  };
};
