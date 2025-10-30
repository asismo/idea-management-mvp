import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODEL, PROMPTS, MAX_TAGS_PER_IDEA, MIN_TAGS_PER_IDEA } from '../utils/constants';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

interface CategorizeResult {
  folder: string;
  confidence: number;
  reasoning: string;
}

interface TagsResult {
  tags: string[];
}

interface SearchResult {
  results: Array<{
    idea_id: string;
    relevance: number;
    reasoning: string;
  }>;
}

// Cache for API responses to avoid redundant calls
const cache = new Map<string, unknown>();

const getCacheKey = (type: string, input: string): string => {
  return `${type}:${input.substring(0, 100)}`;
};

export const categorizeIdea = async (
  content: string,
  existingFolders: string[],
  mode: 'simple' | 'advanced'
): Promise<CategorizeResult> => {
  try {
    if (mode === 'simple') {
      // Simple keyword-based categorization
      const keywords = content.toLowerCase().split(/\s+/).slice(0, 10);
      const matchedFolder = existingFolders.find((folder) =>
        keywords.some((kw) => folder.toLowerCase().includes(kw))
      );

      return {
        folder: matchedFolder || 'General',
        confidence: matchedFolder ? 0.7 : 0.5,
        reasoning: matchedFolder ? 'Matched by keywords' : 'Default category',
      };
    }

    // Advanced semantic categorization with Gemini
    const cacheKey = getCacheKey('categorize', content);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) as CategorizeResult;
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = PROMPTS.CATEGORIZE_IDEA.replace('{idea}', content).replace(
      '{folders}',
      existingFolders.join(', ')
    );

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText) as CategorizeResult;

    cache.set(cacheKey, parsed);
    return parsed;
  } catch (error) {
    console.error('Error categorizing idea:', error);
    return {
      folder: 'General',
      confidence: 0.5,
      reasoning: 'Error in categorization',
    };
  }
};

export const generateTags = async (content: string): Promise<string[]> => {
  try {
    const cacheKey = getCacheKey('tags', content);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) as string[];
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = PROMPTS.GENERATE_TAGS.replace('{idea}', content);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText) as TagsResult;

    // Ensure tags are within limits
    let tags = parsed.tags.slice(0, MAX_TAGS_PER_IDEA);
    if (tags.length < MIN_TAGS_PER_IDEA) {
      tags = [...tags, ...Array(MIN_TAGS_PER_IDEA - tags.length).fill('general')];
    }

    cache.set(cacheKey, tags);
    return tags;
  } catch (error) {
    console.error('Error generating tags:', error);
    return ['general', 'uncategorized'];
  }
};

export const generateFolderDescription = async (
  folderName: string,
  ideas: Array<{ content: string; tags: string[] }>
): Promise<string> => {
  try {
    const cacheKey = getCacheKey('description', folderName + ideas.length);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) as string;
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const ideasText = ideas
      .map((idea, idx) => `${idx + 1}. ${idea.content.substring(0, 200)}`)
      .join('\n');

    const prompt = PROMPTS.GENERATE_DESCRIPTION.replace('{folderName}', folderName).replace(
      '{ideas}',
      ideasText
    );

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    cache.set(cacheKey, description);
    return description;
  } catch (error) {
    console.error('Error generating description:', error);
    return `This folder contains ${ideas.length} ideas related to ${folderName}.`;
  }
};

export const searchConversational = async (
  query: string,
  ideas: Array<{ id: string; content: string; tags: string[] }>,
  mode: 'simple' | 'advanced'
): Promise<Array<{ idea_id: string; relevance: number }>> => {
  try {
    if (mode === 'simple') {
      // Simple keyword-based search
      const queryWords = query.toLowerCase().split(/\s+/);
      return ideas
        .map((idea) => {
          const contentWords = idea.content.toLowerCase().split(/\s+/);
          const matches = queryWords.filter((qw) =>
            contentWords.some((cw) => cw.includes(qw) || qw.includes(cw))
          );
          const tagMatches = idea.tags.filter((tag) =>
            queryWords.some((qw) => tag.toLowerCase().includes(qw))
          );

          const relevance = (matches.length + tagMatches.length * 2) / (queryWords.length * 3);
          return { idea_id: idea.id, relevance: Math.min(relevance, 1) };
        })
        .filter((r) => r.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);
    }

    // Advanced semantic search with Gemini
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const ideasText = ideas
      .map((idea) => `ID: ${idea.id}\nContent: ${idea.content}\nTags: ${idea.tags.join(', ')}`)
      .join('\n\n');

    const prompt = PROMPTS.SEARCH_CONVERSATIONAL.replace('{query}', query).replace(
      '{ideas}',
      ideasText
    );

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText) as SearchResult;

    return parsed.results.map((r) => ({
      idea_id: r.idea_id,
      relevance: r.relevance,
    }));
  } catch (error) {
    console.error('Error in conversational search:', error);
    return [];
  }
};

export const clearCache = (): void => {
  cache.clear();
};
