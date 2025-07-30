'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notesService } from '@/services/notesService';
import { Note, CreateNoteData } from '@/types/note';

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = notesService.subscribeToUserNotes(user.uid, (userNotes) => {
      setNotes(userNotes);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createNote = async (noteData: CreateNoteData) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setCreating(true);
    try {
      await notesService.createNote(user.uid, noteData);
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const updateNote = async (noteId: string, updates: Partial<CreateNoteData>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      await notesService.updateNote(user.uid, noteId, updates);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const saveNote = async (noteId: string | null, noteData: CreateNoteData) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      return await notesService.upsertNote(user.uid, noteId, noteData);
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      await notesService.deleteNote(user.uid, noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return {
    notes,
    loading,
    creating,
    createNote,
    updateNote,
    saveNote,
    deleteNote,
  };
};
