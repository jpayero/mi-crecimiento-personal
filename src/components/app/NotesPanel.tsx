'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/data/books';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotes } from '@/hooks/useLocalStorage';
import { Plus, Save, Trash2, FileText, X } from 'lucide-react';

interface NotesPanelProps {
  book: Book;
  onClose?: () => void;
}

export function NotesPanel({ book, onClose }: NotesPanelProps) {
  const { getNotesForBook, addNote, updateNote, deleteNote } = useNotes();
  const notes = getNotesForBook(book.id);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(book.id, newNote.trim());
      setNewNote('');
    }
  };

  const handleUpdateNote = (noteId: string) => {
    if (editingContent.trim()) {
      updateNote(noteId, editingContent.trim());
      setEditingNoteId(null);
      setEditingContent('');
    }
  };

  const startEditing = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditingContent(content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-slate-900/80 border-slate-700 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-400" />
            Apuntes de "{book.title}"
          </CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden p-2">
        <ScrollArea className="flex-1 pr-2 mb-4">
          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">
                No tienes apuntes para este libro. Agrega tus notas y reflexiones.
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        placeholder="Escribe tu apunte..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          className="border-slate-600"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
                        <span className="text-xs text-slate-500">
                          {formatDate(note.updatedAt)}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-slate-400 hover:text-blue-400"
                            onClick={() => startEditing(note.id, note.content)}
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-slate-700 pt-4">
          <Textarea
            placeholder="Escribe un nuevo apunte o reflexion sobre este libro..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white min-h-[80px] mb-2"
          />
          <Button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Guardar Apunte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
