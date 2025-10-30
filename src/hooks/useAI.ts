import { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';


export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categorizeIdea = useCallback(
    async (content: string, existingFolders: string[], mode: 'simple' | 'advanced') => {
      setLoading(true);
      try {
        const result = await geminiService.categorizeIdea(content, existingFolders, mode);
        setError(null);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to categorize idea';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateTags = useCallback(async (content: string) => {
    setLoading(true);
    try {
      const tags = await geminiService.generateTags(content);
      setError(null);
      return tags;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate tags';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateDescription = useCallback(
    async (folderName: string, ideas: Array<{ content: string; tags: string[] }>) => {
      setLoading(true);
      try {
        const description = await geminiService.generateFolderDescription(folderName, ideas);
        setError(null);
        return description;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate description';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchConversational = useCallback(
    async (
      query: string,
      ideas: Array<{ id: string; content: string; tags: string[] }>,
      mode: 'simple' | 'advanced'
    ) => {
      setLoading(true);
      try {
        const results = await geminiService.searchConversational(query, ideas, mode);
        setError(null);
        return results;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to search ideas';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    categorizeIdea,
    generateTags,
    generateDescription,
    searchConversational,
  };
};
