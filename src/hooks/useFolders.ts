import { useCallback, useEffect } from 'react';
import { useFolderStore } from '../store/folderStore';
import type { Folder } from '../types';
import * as supabaseClient from '../services/supabaseClient';

export const useFolders = () => {
  const {
    folders,
    loading,
    error,
    setFolders,
    addFolder,
    updateFolder,
    deleteFolder,
    setLoading,
    setError,
    mergeFolders,
  } = useFolderStore();

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supabaseClient.getFolders();
      setFolders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, [setFolders, setLoading, setError]);

  const createFolder = useCallback(
    async (name: string, description: string, icon: string) => {
      try {
        const newFolder = await supabaseClient.createFolder(name, description, icon);
        addFolder(newFolder);
        return newFolder;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create folder');
        throw err;
      }
    },
    [addFolder, setError]
  );

  const updateFolderData = useCallback(
    async (id: string, updates: Partial<Folder>) => {
      try {
        const updated = await supabaseClient.updateFolder(id, updates);
        updateFolder(id, updates);
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update folder');
        throw err;
      }
    },
    [updateFolder, setError]
  );

  const deleteFolderData = useCallback(
    async (id: string) => {
      try {
        await supabaseClient.deleteFolder(id);
        deleteFolder(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete folder');
        throw err;
      }
    },
    [deleteFolder, setError]
  );

  const mergeFoldersData = useCallback(
    async (sourceId: string, targetId: string, newDescription: string) => {
      try {
        // Update target folder with new description
        await supabaseClient.updateFolder(targetId, {
          description: newDescription,
          updated_at: new Date().toISOString(),
        });

        // Delete source folder
        await supabaseClient.deleteFolder(sourceId);

        // Update store
        mergeFolders(sourceId, targetId, newDescription);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to merge folders');
        throw err;
      }
    },
    [mergeFolders, setError]
  );

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    error,
    fetchFolders,
    createFolder,
    updateFolder: updateFolderData,
    deleteFolder: deleteFolderData,
    mergeFolders: mergeFoldersData,
  };
};
