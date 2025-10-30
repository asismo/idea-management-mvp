import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { useAI } from '../hooks/useAI';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, folderId: string, tags: string[]) => Promise<void>;
  folders: Array<{ id: string; name: string }>;
  categorizationMode: 'simple' | 'advanced';
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  folders,
  categorizationMode,
}) => {
  const [content, setContent] = useState('');
  const [suggestedFolder, setSuggestedFolder] = useState<string | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  const { categorizeIdea, generateTags } = useAI();

  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Auto-suggest folder and tags when content is entered
    if (newContent.length > 10 && !isProcessing) {
      setIsProcessing(true);
      try {
        const folderNames = folders.map((f) => f.name);
        const categoryResult = await categorizeIdea(newContent, folderNames, categorizationMode);
        setSuggestedFolder(categoryResult.folder);

        const tagsResult = await generateTags(newContent);
        setSuggestedTags(tagsResult);

        // Auto-select the folder
        const matchedFolder = folders.find((f) => f.name === categoryResult.folder);
        if (matchedFolder) {
          setSelectedFolderId(matchedFolder.id);
        }
      } catch (error) {
        console.error('Error generating suggestions:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedFolderId) return;

    try {
      await onSubmit(content, selectedFolderId, suggestedTags);
      setContent('');
      setSuggestedFolder(null);
      setSuggestedTags([]);
      setSelectedFolderId('');
      onClose();
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Capture Idea</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Idea
            </label>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="What's on your mind? Share your idea here..."
              className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Suggestions */}
          {(suggestedFolder || suggestedTags.length > 0) && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="space-y-3">
                {suggestedFolder && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Suggested Folder
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{suggestedFolder}</p>
                  </div>
                )}
                {suggestedTags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Suggested Tags
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Folder Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Folder
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a folder...</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!content.trim() || !selectedFolderId || isProcessing}
              isLoading={isProcessing}
            >
              Save Idea
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
