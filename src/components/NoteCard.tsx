"use client";

import { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function NoteCard({
  note,
  isSelected = false,
  onClick,
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

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
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
        <p className="text-gray-600 text-sm">{truncateText(note.content)}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {note.content && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {note.content.length} caracteres
            </span>
          )}
        </div>

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
  );
}
