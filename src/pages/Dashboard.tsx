import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CaptureModal } from '../components/CaptureModal';
import { SettingsPanel } from '../components/SettingsPanel';
import { OnboardingWalkthrough } from '../components/OnboardingWalkthrough';
import { IdeaCard } from '../components/IdeaCard';
import { Button } from '../components/Button';
import { useIdeas } from '../hooks/useIdeas';
import { useFolders } from '../hooks/useFolders';
import { useSettings } from '../hooks/useSettings';
import { useAI } from '../hooks/useAI';
import { useUIStore } from '../store/uiStore';

export const Dashboard: React.FC = () => {
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [mergeSourceId, setMergeSourceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize state
  const {
    showOnboarding,
    showSettings,
    selectedFolderId,
    searchQuery,
    setShowOnboarding,
    setShowSettings,
    setSelectedFolderId,
    setSearchQuery,
  } = useUIStore();

  // Load data with error handling
  let ideas = [];
  let folders = [];
  let settings = null;
  let createIdea = async () => {};
  let deleteIdea = async () => {};
  let createFolder = async () => {};
  let updateFolder = async () => {};
  let deleteFolder = async () => {};
  let mergeFolders = async () => {};
  let generateDescription = async () => '';

  try {
    const ideasHook = useIdeas();
    const foldersHook = useFolders();
    const settingsHook = useSettings();
    const aiHook = useAI();

    ideas = ideasHook.ideas || [];
    folders = foldersHook.folders || [];
    settings = settingsHook.settings;
    createIdea = ideasHook.createIdea;
    deleteIdea = ideasHook.deleteIdea;
    createFolder = foldersHook.createFolder;
    updateFolder = foldersHook.updateFolder;
    deleteFolder = foldersHook.deleteFolder;
    mergeFolders = foldersHook.mergeFolders;
    generateDescription = aiHook.generateDescription;

    if (ideasHook.error) setError(ideasHook.error);
    if (foldersHook.error) setError(foldersHook.error);
    if (settingsHook.error) setError(settingsHook.error);
  } catch (err) {
    console.error('Error loading data:', err);
    setError(err instanceof Error ? err.message : 'Failed to load data');
  }

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
    } catch (err) {
      console.error('Error capturing idea:', err);
      setError(err instanceof Error ? err.message : 'Failed to save idea');
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
    } catch (err) {
      console.error('Error merging folders:', err);
      setError(err instanceof Error ? err.message : 'Failed to merge folders');
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

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading App</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
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
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Folder Header */}
          {currentFolder && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{currentFolder.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{currentFolder.name}</h1>
                  {currentFolder.description && (
                    <p className="text-sm text-muted-foreground mt-1">{currentFolder.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ideas Grid */}
          {filteredIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-lg text-muted-foreground mb-4">No ideas yet</p>
              <p className="text-sm text-muted-foreground mb-6">Create your first idea to get started</p>
              <Button
                onClick={() => setShowCaptureModal(true)}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Capture Idea
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onDelete={() => deleteIdea(idea.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCaptureModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        title="Capture new idea"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      <CaptureModal
        isOpen={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onSubmit={handleCaptureSubmit}
        folders={folders}
        categorizationMode={settings?.categorization_mode || 'simple'}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <OnboardingWalkthrough
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};
