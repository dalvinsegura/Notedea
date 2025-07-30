"use client";

import { Note } from "@/types/note";
import NoteCard from "@/components/NoteCard";

interface NotesListProps {
  notes: Note[];
  loading: boolean;
  currentNoteId?: string;
  onNoteClick: (noteId: string) => void;
}

export default function NotesList({
  notes,
  loading,
  currentNoteId,
  onNoteClick,
}: NotesListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Cargando ideas...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-lg mb-2">No tienes ideas aún</p>
        <p className="text-gray-500 text-sm">
          ¡Crea tu primera idea para empezar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {notes.length} {notes.length === 1 ? "idea" : "ideas"}
        </h3>
        <span className="text-sm text-gray-500">
          Ordenadas por fecha de actualización
        </span>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isSelected={currentNoteId === note.id}
            onClick={() => onNoteClick(note.id)}
          />
        ))}
      </div>
    </div>
  );
}
