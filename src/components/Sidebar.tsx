import React, { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { Card } from './Card';
import type { Folder } from '../types';

interface SidebarProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onDeleteFolder: (id: string) => void;
  onMergeStart?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onDeleteFolder,
  onMergeStart,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null);

  const _toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, folderId: string) => {
    setDraggedFolderId(folderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedFolderId && draggedFolderId !== targetId && onMergeStart) {
      onMergeStart(draggedFolderId);
    }
    setDraggedFolderId(null);
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Folders</h2>
      </div>

      {/* Folders List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {folders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">No folders yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Create your first idea to start</p>
          </div>
        ) : (
          folders.map((folder) => (
            <div key={folder.id}>
              {/* Folder Item */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, folder.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, folder.id)}
                className={`
                  flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                  ${
                    selectedFolderId === folder.id
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                  ${draggedFolderId === folder.id ? 'opacity-50' : ''}
                `}
                onClick={() => onSelectFolder(folder.id)}
              >
                <GripVertical size={16} className="text-slate-400 dark:text-slate-600" />
                <span className="text-lg">{folder.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                    {folder.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {folder.idea_count} {folder.idea_count === 1 ? 'idea' : 'ideas'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete folder"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Folder Description (Expandable) */}
              {expandedFolders.has(folder.id) && folder.description && (
                <div className="ml-8 mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400 border-l-2 border-blue-300 dark:border-blue-700">
                  {folder.description.substring(0, 150)}...
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <p>💡 Drag folders to merge them</p>
      </div>
    </div>
  );
};
