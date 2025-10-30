import { createClient } from '@supabase/supabase-js';
import { Idea, Folder, Settings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Session management
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Ideas CRUD
export const createIdea = async (
  content: string,
  folderId: string,
  tags: string[]
): Promise<Idea> => {
  const sessionId = getOrCreateSessionId();
  const { data, error } = await supabase
    .from('ideas')
    .insert([
      {
        session_id: sessionId,
        content,
        folder_id: folderId,
        tags,
        ai_categorization_accepted: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getIdeas = async (): Promise<Idea[]> => {
  const sessionId = getOrCreateSessionId();
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getIdeasByFolder = async (folderId: string): Promise<Idea[]> => {
  const sessionId = getOrCreateSessionId();
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('session_id', sessionId)
    .eq('folder_id', folderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateIdea = async (id: string, updates: Partial<Idea>): Promise<Idea> => {
  const { data, error } = await supabase
    .from('ideas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteIdea = async (id: string): Promise<void> => {
  const { error } = await supabase.from('ideas').delete().eq('id', id);
  if (error) throw error;
};

// Folders CRUD
export const createFolder = async (
  name: string,
  description: string,
  icon: string
): Promise<Folder> => {
  const sessionId = getOrCreateSessionId();
  const { data, error } = await supabase
    .from('folders')
    .insert([
      {
        session_id: sessionId,
        name,
        description,
        icon,
        idea_count: 0,
        tags: [],
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFolders = async (): Promise<Folder[]> => {
  const sessionId = getOrCreateSessionId();
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateFolder = async (id: string, updates: Partial<Folder>): Promise<Folder> => {
  const { data, error } = await supabase
    .from('folders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFolder = async (id: string): Promise<void> => {
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) throw error;
};

// Settings CRUD
export const getSettings = async (): Promise<Settings | null> => {
  const sessionId = getOrCreateSessionId();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

export const updateSettings = async (updates: Partial<Settings>): Promise<Settings> => {
  const sessionId = getOrCreateSessionId();
  const { data, error } = await supabase
    .from('settings')
    .upsert({
      session_id: sessionId,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
