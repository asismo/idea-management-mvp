import { useCallback, useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Settings } from '../types';
import * as supabaseClient from '../services/supabaseClient';
import { DEFAULT_SETTINGS } from '../utils/constants';

export const useSettings = () => {
  const { settings, loading, error, setSettings, updateSetting, setLoading, setError } =
    useSettingsStore();

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = supabaseClient.getOrCreateSessionId();
      let data = await supabaseClient.getSettings();

      if (!data) {
        // Create default settings if they don't exist
        data = await supabaseClient.updateSettings({
          ...DEFAULT_SETTINGS,
          session_id: sessionId,
        });
      }

      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [setSettings, setLoading, setError]);

  const updateSettingData = useCallback(
    async <K extends keyof Settings>(key: K, value: Settings[K]) => {
      try {
        updateSetting(key, value);
        await supabaseClient.updateSettings({
          [key]: value,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update settings');
        throw err;
      }
    },
    [updateSetting, setError]
  );

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSetting: updateSettingData,
  };
};
