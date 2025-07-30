"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/hooks/useNotes";
import NoteEditor from "@/components/NoteEditor";
import NotesList from "@/components/NotesList";

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
          {/* Header con botón de nueva idea */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Mis Ideas</h2>
            <button
              onClick={handleNewNote}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Nueva Idea</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div
              className={`${showEditor ? "lg:col-span-1" : "lg:col-span-2"}`}
            >
              <NotesList
                notes={notes}
                loading={loading}
                currentNoteId={currentNoteId}
                onNoteClick={handleEditNote}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
