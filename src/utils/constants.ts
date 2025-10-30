export const AUDIO_SERVICES = ['google', 'openai', 'deepgram', 'assemblyai'] as const;
export const CATEGORIZATION_MODES = ['simple', 'advanced'] as const;
export const SEARCH_MODES = ['simple', 'advanced'] as const;
export const THEMES = ['light', 'dark', 'system'] as const;

export const DEFAULT_SETTINGS = {
  categorization_mode: 'simple' as const,
  search_mode: 'simple' as const,
  input_method: 'text' as const,
  theme: 'system' as const,
  auto_update_descriptions: true,
  onboarding_completed: false,
};

export const GEMINI_MODEL = 'gemini-1.5-flash';
export const MAX_TAGS_PER_IDEA = 5;
export const MIN_TAGS_PER_IDEA = 2;

export const FOLDER_ICONS = ['📁', '📚', '💡', '🎯', '🔬', '📊', '🎨', '🚀', '💼', '📝'];

export const PROMPTS = {
  CATEGORIZE_IDEA: `You are an AI assistant that categorizes ideas into folders. 
Given the following idea content and existing folder names, suggest which folder this idea belongs to.
If none of the existing folders fit well, suggest a new folder name.

Idea: {idea}
Existing folders: {folders}

Respond in JSON format:
{
  "folder": "folder name",
  "confidence": 0.95,
  "reasoning": "brief explanation"
}`,

  GENERATE_TAGS: `You are an AI assistant that extracts relevant tags from ideas.
Extract 2-5 relevant tags from the following idea content.
Tags should be lowercase, single words or hyphenated phrases.

Idea: {idea}

Respond in JSON format:
{
  "tags": ["tag1", "tag2", "tag3"]
}`,

  GENERATE_DESCRIPTION: `You are an AI assistant that summarizes folder contents.
Given the following ideas in a folder, generate a 2-3 paragraph description of the folder's purpose and themes.
Highlight relationships between ideas and mention key tags.

Folder name: {folderName}
Ideas: {ideas}

Respond with only the description text, no JSON.`,

  SEARCH_CONVERSATIONAL: `You are an AI assistant that helps users find relevant ideas.
Given the following query and list of ideas, find and return the most relevant ideas.

Query: {query}
Ideas: {ideas}

Respond in JSON format:
{
  "results": [
    {
      "idea_id": "id",
      "relevance": 0.95,
      "reasoning": "why this idea is relevant"
    }
  ]
}`,
};
