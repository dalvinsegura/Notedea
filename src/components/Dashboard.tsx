"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/hooks/useNotes";
import NoteEditor from "@/components/NoteEditor";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { notes, loading } = useNotes();
  const [showEditor, setShowEditor] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | undefined>();

  const handleNewNote = () => {
    setCurrentNoteId(undefined);
    setShowEditor(true);
  };

  const handleEditNote = (noteId: string) => {
    setCurrentNoteId(noteId);
    setShowEditor(true);
  };

  const handleNoteIdChange = (noteId: string) => {
    setCurrentNoteId(noteId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Notedea</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bienvenido, {user?.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Botón para crear nueva idea */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Mis Ideas
            </h2>
            <button
              onClick={handleNewNote}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              + Nueva Idea
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor de notas */}
            {showEditor && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <NoteEditor
                    noteId={currentNoteId}
                    onNoteIdChange={handleNoteIdChange}
                  />
                </div>
              </div>
            )}

            {/* Lista de ideas */}
            <div className={`${showEditor ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Cargando ideas...</p>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No tienes ideas aún. ¡Crea tu primera idea!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {notes.length} {notes.length === 1 ? 'idea' : 'ideas'}
                  </h3>
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleEditNote(note.id)}
                      className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                        currentNoteId === note.id 
                          ? 'border-indigo-500 ring-2 ring-indigo-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {note.title || 'Sin título'}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                      {note.content && (
                        <p className="text-gray-600 text-sm">
                          {truncateText(note.content)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
