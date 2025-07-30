"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NoteEditor from "@/components/NoteEditor";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | undefined>();

  const handleNewNote = () => {
    setCurrentNoteId(undefined);
    setShowEditor(true);
  };

  const handleNoteIdChange = (noteId: string) => {
    setCurrentNoteId(noteId);
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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
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

          {/* Editor de notas */}
          {showEditor && (
            <div className="mb-6">
              <NoteEditor
                noteId={currentNoteId}
                onNoteIdChange={handleNoteIdChange}
              />
            </div>
          )}

          {/* Lista de ideas (próximamente) */}
          {!showEditor && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No tienes ideas aún. ¡Crea tu primera idea!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
