import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CaptureModal } from '../components/CaptureModal';
import { SettingsPanel } from '../components/SettingsPanel';
import { OnboardingWalkthrough } from '../components/OnboardingWalkthrough';
import { IdeaCard } from '../components/IdeaCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useIdeas } from '../hooks/useIdeas';
import { useFolders } from '../hooks/useFolders';
import { useSettings } from '../hooks/useSettings';
import { useAI } from '../hooks/useAI';
import { useUIStore } from '../store/uiStore';
import type { Folder } from '../types';

export const Dashboard: React.FC = () => {
  const { ideas, createIdea, deleteIdea } = useIdeas();
  const { folders, createFolder, updateFolder, deleteFolder, mergeFolders } = useFolders();
  const { settings, updateSetting } = useSettings();
  const { generateDescription } = useAI();

  const {
    showOnboarding,
    showSettings,
    selectedFolderId,
    searchQuery,
    theme,
    setShowOnboarding,
    setShowSettings,
    setSelectedFolderId,
    setSearchQuery,
    setTheme,
  } = useUIStore();

  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [mergeSourceId, setMergeSourceId] = useState<string | null>(null);

  // Initialize theme
  useEffect(() => {
    const isDark =
      theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Show onboarding on first visit
  useEffect(() => {
    if (settings && !settings.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [settings, setShowOnboarding]);

  const handleCaptureSubmit = async (content: string, folderId: string, tags: string[]) => {
    try {
      // Create or get folder
      let folder = folders.find((f) => f.id === folderId);
      if (!folder) {
        const newFolder = await createFolder('General', 'Auto-generated folder', '📁');
        folder = newFolder;
      }

      // Create idea
      await createIdea(content, folderId, tags);

      // Update folder description if auto-update is enabled
      if (settings?.auto_update_descriptions) {
        const folderIdeas = ideas.filter((i) => i.folder_id === folderId);
        const description = await generateDescription(folder.name, folderIdeas);
        await updateFolder(folderId, { description });
      }
    } catch (error) {
      console.error('Error capturing idea:', error);
    }
  };

  const handleMergeFolders = async (targetId: string) => {
    if (!mergeSourceId) return;

    try {
      const sourceFolder = folders.find((f) => f.id === mergeSourceId);
      const targetFolder = folders.find((f) => f.id === targetId);

      if (!sourceFolder || !targetFolder) return;

      // Get all ideas from both folders
      const sourceIdeas = ideas.filter((i) => i.folder_id === mergeSourceId);
      const targetIdeas = ideas.filter((i) => i.folder_id === targetId);
      const allIdeas = [...sourceIdeas, ...targetIdeas];

      // Generate new description
      const newDescription = await generateDescription(targetFolder.name, allIdeas);

      // Merge folders
      await mergeFolders(mergeSourceId, targetId, newDescription);

      setMergeSourceId(null);
    } catch (error) {
      console.error('Error merging folders:', error);
    }
  };

  // Filter ideas based on search and folder selection
  const filteredIdeas = ideas.filter((idea) => {
    const matchesFolder = !selectedFolderId || idea.folder_id === selectedFolderId;
    const matchesSearch =
      !searchQuery ||
      idea.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const currentFolder = selectedFolderId ? folders.find((f) => f.id === selectedFolderId) : null;

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onDeleteFolder={deleteFolder}
        onMergeStart={setMergeSourceId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSettingsClick={() => setShowSettings(true)}
          onHelpClick={() => setShowOnboarding(true)}
          theme={theme}
          onThemeChange={setTheme}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Folder Header */}
          {currentFolder && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{currentFolder.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {currentFolder.name}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {currentFolder.idea_count} ideas
                  </p>
                </div>
              </div>
              {currentFolder.description && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentFolder.description}
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Ideas Grid */}
          {filteredIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
                {ideas.length === 0 ? 'No ideas yet' : 'No ideas match your search'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {ideas.length === 0
                  ? 'Create your first idea to get started'
                  : 'Try a different search query'}
              </p>
              {ideas.length === 0 && (
                <Button variant="primary" onClick={() => setShowCaptureModal(true)}>
                  <Plus size={16} className="mr-2" />
                  Capture Idea
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  folder={folders.find((f) => f.id === idea.folder_id)}
                  onDelete={deleteIdea}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowCaptureModal(true)}
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <Plus size={24} />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <CaptureModal
        isOpen={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onSubmit={handleCaptureSubmit}
        folders={folders}
        categorizationMode={settings?.categorization_mode || 'simple'}
      />

      {settings && (
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={updateSetting}
        />
      )}

      <OnboardingWalkthrough
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => settings && updateSetting('onboarding_completed', true)}
      />

      {/* Merge Confirmation */}
      {mergeSourceId && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Merge Folders?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This will merge{' '}
              <strong>{folders.find((f) => f.id === mergeSourceId)?.name}</strong> into{' '}
              <strong>{currentFolder?.name}</strong>. The description will be updated automatically.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setMergeSourceId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleMergeFolders(selectedFolderId || '')}
              >
                Merge
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
