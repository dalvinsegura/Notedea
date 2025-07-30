"use client";

import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";

interface CreateNoteFormProps {
  onClose?: () => void;
}

export default function CreateNoteForm({ onClose }: CreateNoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote, creating } = useNotes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      await createNote({
        title: title.trim(),
        content: content.trim(),
      });

      // Limpiar formulario
      setTitle("");
      setContent("");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      alert("Error al crear la nota. Inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Título de la idea
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Escribe el título de tu idea..."
          disabled={creating}
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Contenido
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe tu idea..."
          disabled={creating}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={creating}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {creating ? "Guardando..." : "Guardar Idea"}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
