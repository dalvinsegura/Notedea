'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { CreateNoteData } from '@/types/note';

interface UseAutoSaveOptions {
  delay?: number; 
  initialTitle?: string;
  initialContent?: string;
  noteId?: string; 
}

export const useAutoSave = ({
  delay = 1000,
  initialTitle = '',
  initialContent = '',
  noteId
}: UseAutoSaveOptions = {}) => {
  const { user } = useAuth();
  const { saveNote } = useNotes();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentNoteId, setCurrentNoteId] = useState(noteId);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (initialTitle !== title) {
      setTitle(initialTitle);
    }
  }, [initialTitle, title]);

  useEffect(() => {
    if (initialContent !== content) {
      setContent(initialContent);
    }
  }, [initialContent, content]);

  useEffect(() => {
    if (noteId !== currentNoteId) {
      setCurrentNoteId(noteId);
    }
  }, [noteId, currentNoteId]);

  const saveNoteData = useCallback(async (titleToSave: string, contentToSave: string) => {
    if (!user || (!titleToSave.trim() && !contentToSave.trim())) return;

    setIsSaving(true);
    try {
      const noteData: CreateNoteData = {
        title: titleToSave.trim() || 'Sin título',
        content: contentToSave.trim(),
      };

      const resultNoteId = await saveNote(currentNoteId || null, noteData);
      
      if (!currentNoteId) {
        setCurrentNoteId(resultNoteId);
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  }, [user, currentNoteId, saveNote]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (title.trim() || content.trim()) {
        saveNoteData(title, content);
      }
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, delay, saveNoteData]);

  const forceSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveNoteData(title, content);
  }, [title, content, saveNoteData]);

  return {
    title,
    content,
    setTitle,
    setContent,
    isSaving,
    lastSaved,
    noteId: currentNoteId,
    forceSave,
  };
};
