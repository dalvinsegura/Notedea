"use client";

import { useState, useRef, useEffect } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface LiveMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LiveMarkdownEditor({
  value,
  onChange,
  placeholder,
  className = "",
}: LiveMarkdownEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Manejar el input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart;

    onChange(newValue);
    setCursorPosition(position);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter para cambiar a preview
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);
      return;
    }

    if (e.key === "Enter") {
      const textarea = e.target as HTMLTextAreaElement;
      const { value, selectionStart } = textarea;
      const lines = value.substring(0, selectionStart).split("\n");
      const currentLine = lines[lines.length - 1];

      const listMatch = currentLine.match(/^(\s*)([-\*\+]|\d+\.)\s/);
      if (listMatch) {
        e.preventDefault();
        const [, spaces, marker] = listMatch;
        let nextMarker = marker;

        if (/\d+\./.test(marker)) {
          const num = parseInt(marker) + 1;
          nextMarker = `${num}.`;
        }

        const newText =
          value.substring(0, selectionStart) +
          `\n${spaces}${nextMarker} ` +
          value.substring(selectionStart);

        onChange(newText);

        setTimeout(() => {
          const newPosition =
            selectionStart + spaces.length + nextMarker.length + 2;
          setCursorPosition(newPosition);
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };

  const handleContainerClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (
        textareaRef.current &&
        document.activeElement !== textareaRef.current
      ) {
        setIsEditing(false);
      }
    }, 200);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [isEditing, cursorPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[400px] ${className}`}
      onClick={handleContainerClick}
    >
      {isEditing ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full h-full min-h-[400px] p-4 border border-blue-300 rounded-lg outline-none resize-none text-gray-700 leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            style={{
              resize: "none",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
            autoFocus
          />

          <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
            ✏️ Editando
          </div>

          <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-75">
            Cmd+Enter o Esc para vista previa
          </div>
        </div>
      ) : (
        <div className="min-h-[400px] p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all cursor-text relative">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <div className="text-gray-400 italic">
              {placeholder || "Haz clic aquí para comenzar a escribir..."}
            </div>
          )}

          <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
            👁️ Haz clic para editar
          </div>
        </div>
      )}
    </div>
  );
}
