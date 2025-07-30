"use client";

import { useAutoSave } from "@/hooks/useAutoSave";
import { useNotes } from "@/hooks/useNotes";
import { useEffect, useState } from "react";
import { Note } from "@/types/note";

interface NoteEditorProps {
  noteId?: string;
  initialTitle?: string;
  initialContent?: string;
  onNoteIdChange?: (noteId: string) => void;
}

export default function NoteEditor({
  noteId,
  initialTitle,
  initialContent,
  onNoteIdChange,
}: NoteEditorProps) {
  const { notes } = useNotes();
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  // Buscar la nota actual cuando se cambia el noteId
  useEffect(() => {
    if (noteId && notes.length > 0) {
      const note = notes.find((n) => n.id === noteId);
      setCurrentNote(note || null);
    } else {
      setCurrentNote(null);
    }
  }, [noteId, notes]);

  const {
    title,
    content,
    setTitle,
    setContent,
    isSaving,
    lastSaved,
    noteId: currentNoteId,
  } = useAutoSave({
    delay: 800, // Guarda después de 800ms de inactividad
    initialTitle: currentNote?.title || initialTitle || "",
    initialContent: currentNote?.content || initialContent || "",
    noteId,
  });

  useEffect(() => {
    if (currentNoteId && onNoteIdChange) {
      onNoteIdChange(currentNoteId);
    }
  }, [currentNoteId, onNoteIdChange]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSaving ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span className="text-xs">Guardando...</span>
              </div>
            ) : lastSaved ? (
              <div className="text-xs text-gray-500">
                Guardado a las {formatTime(lastSaved)}
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                Escribe para guardar automáticamente
              </div>
            )}
          </div>
          {currentNoteId && (
            <div className="text-xs text-gray-400">
              ID: {currentNoteId.slice(-6)}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de tu idea..."
          className="w-full text-xl font-semibold border-none outline-none resize-none placeholder-gray-400 bg-transparent text-gray-900 focus:text-gray-900"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu idea aquí..."
          className="w-full mt-4 min-h-[200px] border-none outline-none resize-none placeholder-gray-400 bg-transparent text-gray-700 leading-relaxed focus:text-gray-800"
          style={{ resize: "none" }}
        />
      </div>
    </div>
  );
}
