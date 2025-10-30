import React from 'react';
import { Search, Settings, Moon, Sun, HelpCircle } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSettingsClick,
  onHelpClick,
  theme,
  onThemeChange,
}) => {
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">💡</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">Ideas</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-600" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onHelpClick}
            title="Help (Ctrl+?)"
            className="p-2"
          >
            <HelpCircle size={20} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
            title="Toggle theme"
            className="p-2"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            title="Settings"
            className="p-2"
          >
            <Settings size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};
