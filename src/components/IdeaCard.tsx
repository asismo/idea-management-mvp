import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { Card } from './Card';
import type { Idea, Folder } from '../types';

interface IdeaCardProps {
  idea: Idea;
  folder?: Folder;
  onDelete?: (id: string) => void;
  onEdit?: (idea: Idea) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, folder, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const snippet = idea.content.substring(0, 100);
  const hasMore = idea.content.length > 100;

  return (
    <Card hoverable className="animate-slide-up">
      <div className="flex flex-col gap-3">
        {/* Content */}
        <div className="flex-1">
          <p className="text-slate-900 dark:text-slate-50 text-sm leading-relaxed">
            {isExpanded ? idea.content : snippet}
            {hasMore && !isExpanded && '...'}
          </p>
          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs mt-2 font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {folder && <span className="font-medium">{folder.icon} {folder.name}</span>}
            <span>{formatDate(idea.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(idea)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                title="Edit idea"
              >
                <Edit2 size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(idea.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
                title="Delete idea"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
