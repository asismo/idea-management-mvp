import React from 'react';
import { Search, Settings, Moon, Sun, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSettingsClick,
  onHelpClick,
}) => {
  const { theme, setTheme, isDark } = useTheme();

  const handleThemeToggle = () => {
    if (isDark) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">💡</span>
          </div>
          <h1 className="text-lg font-bold text-foreground">Ideas</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
            onClick={handleThemeToggle}
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
