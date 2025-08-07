"use client";

import { Note } from "@/types/note";
import MarkdownRenderer from "./MarkdownRenderer";

interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: (noteId: string) => void;
}

export default function NoteCard({
  note,
  isSelected = false,
  onClick,
  onDelete,
}: NoteCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Función para extraer texto plano del markdown para el truncado
  const getPlainTextFromMarkdown = (markdown: string) => {
    return markdown
      .replace(/^#+\s+/gm, "") // Eliminar encabezados
      .replace(/\*\*(.*?)\*\*/g, "$1") // Eliminar negrita
      .replace(/\*(.*?)\*/g, "$1") // Eliminar cursiva
      .replace(/`(.*?)`/g, "$1") // Eliminar código inline
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Eliminar enlaces, mantener texto
      .replace(/^[>\-*+]\s+/gm, "") // Eliminar marcadores de lista y citas
      .replace(/\n+/g, " ") // Reemplazar saltos de línea con espacios
      .trim();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      onDelete &&
      window.confirm("¿Estás seguro de que quieres eliminar esta nota?")
    ) {
      onDelete(note.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
      data-testid={`note-card-${note.id}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 truncate">
          {note.title || "Sin título"}
        </h4>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {formatDate(note.updatedAt)}
        </span>
      </div>
      {note.content && (
        <div className="text-gray-600 text-sm overflow-hidden">
          <div className="max-h-16 overflow-hidden">
            <MarkdownRenderer
              content={truncateText(
                getPlainTextFromMarkdown(note.content),
                100
              )}
              className="prose-sm prose-gray"
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {note.content && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              📝 {getPlainTextFromMarkdown(note.content).length} palabras
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
              title="Eliminar nota"
              data-testid={`delete-note-${note.id}`}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}

          {isSelected && (
            <div className="text-indigo-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
