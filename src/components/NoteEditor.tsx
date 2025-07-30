"use client";

import { useAutoSave } from "@/hooks/useAutoSave";
import { useNotes } from "@/hooks/useNotes";
import { useEffect, useState } from "react";
import { Note } from "@/types/note";
import LiveMarkdownEditor from "./LiveMarkdownEditor";

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
    delay: 1000,
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full"
         style={{ minHeight: "600px" }}>
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

      <div className="flex-1 overflow-hidden">
        {/* Título */}
        <div className="px-4 pt-4 pb-2 border-b border-gray-100">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de tu idea..."
            className="w-full text-xl font-semibold border-none outline-none resize-none placeholder-gray-400 bg-transparent text-gray-900 focus:text-gray-900"
          />
        </div>

        {/* Editor de Markdown en tiempo real */}
        <div className="p-4 h-full">
          <LiveMarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Escribe tu idea aquí... 

💡 Puedes usar Markdown y verás el resultado en tiempo real:
# Títulos grandes
## Títulos medianos  
**texto en negrita**, *texto en cursiva*
- Listas con viñetas
1. Listas numeradas
> Citas importantes
`código en línea`

```javascript
// Bloques de código
console.log('¡Hola mundo!');
```

[Enlaces](https://ejemplo.com) y mucho más..."
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
