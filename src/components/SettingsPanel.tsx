import React from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import type { Settings } from '../types';
import { AUDIO_SERVICES, CATEGORIZATION_MODES, SEARCH_MODES, THEMES } from '../utils/constants';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings | null;
  onSettingsChange: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen || !settings) return null;

  const handleChange = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    try {
      await onSettingsChange(key, value);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* AI Settings */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">AI Behavior</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Categorization Mode
                </label>
                <select
                  value={settings.categorization_mode}
                  onChange={(e) =>
                    handleChange('categorization_mode', e.target.value as 'simple' | 'advanced')
                  }
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                >
                  {CATEGORIZATION_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {settings.categorization_mode === 'simple'
                    ? 'Fast keyword-based categorization'
                    : 'Advanced semantic analysis with AI'}
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Search Mode
                </label>
                <select
                  value={settings.search_mode}
                  onChange={(e) => handleChange('search_mode', e.target.value as 'simple' | 'advanced')}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                >
                  {SEARCH_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {settings.search_mode === 'simple'
                    ? 'Keyword and tag-based search'
                    : 'Natural language conversational search'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-700 dark:text-slate-300">
                  Auto-update folder descriptions
                </label>
                <button
                  onClick={() =>
                    handleChange('auto_update_descriptions', !settings.auto_update_descriptions)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.auto_update_descriptions
                      ? 'bg-blue-500'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.auto_update_descriptions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Input Settings */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">Input Method</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-700 dark:text-slate-300">Enable voice input</label>
                <button
                  onClick={() => handleChange('input_method', settings.input_method === 'text' ? 'voice' : 'text')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.input_method === 'voice' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.input_method === 'voice' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.input_method === 'voice' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                      Audio Service
                    </label>
                    <select
                      value={settings.audio_service || ''}
                      onChange={(e) => handleChange('audio_service', e.target.value as any)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                    >
                      <option value="">Select a service...</option>
                      {AUDIO_SERVICES.map((service) => (
                        <option key={service} value={service}>
                          {service.charAt(0).toUpperCase() + service.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {settings.audio_service && (
                    <div>
                      <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your API key"
                        value={settings.audio_api_key || ''}
                        onChange={(e) => handleChange('audio_api_key', e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Your API key is stored securely and never shared
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">Display</h3>
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value as 'light' | 'dark' | 'system')}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
              >
                {THEMES.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};
