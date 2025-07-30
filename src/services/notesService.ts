import { 
  ref, 
  push, 
  set, 
  remove, 
  onValue, 
  off,
  serverTimestamp,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { Note, CreateNoteData } from '@/types/note';

const NOTES_PATH = 'notes';

export const notesService = {
  async createNote(userId: string, noteData: CreateNoteData): Promise<string> {
    const notesRef = ref(database, `${NOTES_PATH}/${userId}`);
    const newNoteRef = push(notesRef);
    
    await set(newNoteRef, {
      ...noteData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return newNoteRef.key!;
  },

  async updateNote(userId: string, noteId: string, updates: Partial<CreateNoteData>): Promise<void> {
    const noteRef = ref(database, `${NOTES_PATH}/${userId}/${noteId}`);
    await set(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async saveNote(userId: string, noteId: string, noteData: CreateNoteData): Promise<void> {
    const noteRef = ref(database, `${NOTES_PATH}/${userId}/${noteId}`);
    await set(noteRef, {
      ...noteData,
      userId,
      updatedAt: serverTimestamp(),
    });
  },

  async upsertNote(userId: string, noteId: string | null, noteData: CreateNoteData): Promise<string> {
    if (noteId) {
      await this.saveNote(userId, noteId, noteData);
      return noteId;
    } else {
      return await this.createNote(userId, noteData);
    }
  },

  async deleteNote(userId: string, noteId: string): Promise<void> {
    const noteRef = ref(database, `${NOTES_PATH}/${userId}/${noteId}`);
    await remove(noteRef);
  },

  subscribeToUserNotes(userId: string, callback: (notes: Note[]) => void): () => void {
    const userNotesRef = ref(database, `${NOTES_PATH}/${userId}`);
    
    const handleData = (snapshot: any) => {
      const notes: Note[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((key) => {
          const noteData = data[key];
          notes.push({
            id: key,
            title: noteData.title || '',
            content: noteData.content || '',
            userId: noteData.userId,
            createdAt: noteData.createdAt ? new Date(noteData.createdAt) : new Date(),
            updatedAt: noteData.updatedAt ? new Date(noteData.updatedAt) : new Date(),
          });
        });
        
        notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      }
      callback(notes);
    };

    onValue(userNotesRef, handleData);

    return () => {
      off(userNotesRef, 'value', handleData);
    };
  },
};
