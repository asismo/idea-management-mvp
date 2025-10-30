export interface Idea {
  id: string;
  session_id: string;
  content: string;
  tags: string[];
  folder_id: string;
  created_at: string;
  updated_at: string;
  ai_categorization_accepted: boolean;
}

export interface Folder {
  id: string;
  session_id: string;
  name: string;
  description: string;
  icon: string;
  idea_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Settings {
  session_id: string;
  categorization_mode: 'simple' | 'advanced';
  search_mode: 'simple' | 'advanced';
  input_method: 'text' | 'voice';
  audio_service?: 'google' | 'openai' | 'deepgram' | 'assemblyai';
  audio_api_key?: string;
  theme: 'light' | 'dark' | 'system';
  auto_update_descriptions: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  idea: Idea;
  folder: Folder;
  relevance: number;
}

export interface AIResponse {
  category: string;
  tags: string[];
  description: string;
}

export interface CaptureInput {
  content: string;
  type: 'text' | 'voice';
}
