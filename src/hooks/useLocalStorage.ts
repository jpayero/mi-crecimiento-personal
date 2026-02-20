'use client';

import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get initial value from localStorage if available
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export interface TaskProgress {
  bookId: string;
  tasks: { id: string; completed: boolean }[];
}

export interface Note {
  id: string;
  bookId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthData {
  booksStudied: string[];
  tasksCompleted: number;
  totalTasks: number;
  hoursStudied: number;
  streakDays: number;
  lastStudyDate: string | null;
  notes: Note[];
  customBooks: { id: string; title: string; author: string }[];
}

const STORAGE_KEYS = {
  TASK_PROGRESS: 'mi-crecimiento-task-progress',
  GROWTH_DATA: 'mi-crecimiento-growth-data',
  NOTES: 'mi-crecimiento-notes',
  CUSTOM_BOOKS: 'mi-crecimiento-custom-books',
  STUDY_HOURS: 'mi-crecimiento-study-hours',
  STREAK: 'mi-crecimiento-streak',
  GENERATED_BOOKS: 'mi-crecimiento-generated-books',
  UPLOADED_BOOKS: 'mi-crecimiento-uploaded-books',
};

export interface GeneratedBook {
  id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  cards: { id: string; title: string; content: string; icon: string }[];
  tasks: { id: string; text: string; completed: boolean }[];
  fullContent?: string[]; // Content chunks for reading
  totalCharacters?: number;
  isUploaded?: boolean;
  uploadedAt?: string;
  source?: string;
}

export function useTaskProgress(bookId: string) {
  const [allProgress, setAllProgress] = useLocalStorage<TaskProgress[]>(STORAGE_KEYS.TASK_PROGRESS, []);

  const getTaskProgress = useCallback(() => {
    const bookProgress = allProgress.find(p => p.bookId === bookId);
    return bookProgress?.tasks || [];
  }, [allProgress, bookId]);

  const toggleTask = useCallback((taskId: string) => {
    setAllProgress((prev) => {
      const existing = prev.find(p => p.bookId === bookId);
      if (existing) {
        return prev.map(p => {
          if (p.bookId === bookId) {
            const tasks = p.tasks.map(t =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            );
            return { ...p, tasks };
          }
          return p;
        });
      } else {
        return [...prev, { bookId, tasks: [{ id: taskId, completed: true }] }];
      }
    });
  }, [bookId, setAllProgress]);

  const setTasksForBook = useCallback((tasks: { id: string; completed: boolean }[]) => {
    setAllProgress((prev) => {
      const existing = prev.find(p => p.bookId === bookId);
      if (existing) {
        return prev.map(p => (p.bookId === bookId ? { ...p, tasks } : p));
      }
      return [...prev, { bookId, tasks }];
    });
  }, [bookId, setAllProgress]);

  return { getTaskProgress, toggleTask, setTasksForBook };
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.NOTES, []);

  const getNotesForBook = useCallback((bookId: string) => {
    return notes.filter(n => n.bookId === bookId);
  }, [notes]);

  const addNote = useCallback((bookId: string, content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      bookId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
    return newNote;
  }, [setNotes]);

  const updateNote = useCallback((noteId: string, content: string) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId
        ? { ...n, content, updatedAt: new Date().toISOString() }
        : n
    ));
  }, [setNotes]);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }, [setNotes]);

  return { notes, getNotesForBook, addNote, updateNote, deleteNote };
}

// Helper to safely store large data
function safeSetItem(key: string, value: string): boolean {
  try {
    // Try localStorage first
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn('localStorage full, trying sessionStorage');
    try {
      // Fallback to sessionStorage
      sessionStorage.setItem(key, value);
      return true;
    } catch (e2) {
      console.error('Both storage methods failed', e2);
      return false;
    }
  }
}

function safeGetItem(key: string): string | null {
  // Check localStorage first
  let value = localStorage.getItem(key);
  if (!value) {
    // Fallback to sessionStorage
    value = sessionStorage.getItem(key);
  }
  return value;
}

export function useGrowth() {
  const [studyHours, setStudyHours] = useLocalStorage<{ date: string; minutes: number }[]>(STORAGE_KEYS.STUDY_HOURS, []);
  const [streak, setStreak] = useLocalStorage<{ current: number; lastDate: string | null }>(STORAGE_KEYS.STREAK, { current: 0, lastDate: null });
  const [booksStudied, setBooksStudied] = useLocalStorage<string[]>(STORAGE_KEYS.GROWTH_DATA, []);
  const [customBooks, setCustomBooks] = useLocalStorage<{ id: string; title: string; author: string }[]>(STORAGE_KEYS.CUSTOM_BOOKS, []);
  const [generatedBooks, setGeneratedBooks] = useLocalStorage<GeneratedBook[]>(STORAGE_KEYS.GENERATED_BOOKS, []);
  const [uploadedBooks, setUploadedBooks] = useLocalStorage<GeneratedBook[]>(STORAGE_KEYS.UPLOADED_BOOKS, []);
  const [allProgress] = useLocalStorage<TaskProgress[]>(STORAGE_KEYS.TASK_PROGRESS, []);

  const addStudyTime = useCallback((minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setStudyHours(prev => {
      const existing = prev.find(h => h.date === today);
      if (existing) {
        return prev.map(h => h.date === today ? { ...h, minutes: h.minutes + minutes } : h);
      }
      return [...prev, { date: today, minutes }];
    });

    // Update streak
    const lastDate = streak.lastDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr || lastDate === today) {
      if (lastDate !== today) {
        setStreak({ current: streak.current + 1, lastDate: today });
      }
    } else if (lastDate !== today) {
      setStreak({ current: 1, lastDate: today });
    }
  }, [setStudyHours, setStreak, streak]);

  const markBookAsStudied = useCallback((bookId: string) => {
    setBooksStudied(prev => {
      if (!prev.includes(bookId)) {
        return [...prev, bookId];
      }
      return prev;
    });
  }, [setBooksStudied]);

  const addCustomBook = useCallback((title: string, author: string) => {
    const newBook = { id: `custom-${Date.now()}`, title, author };
    setCustomBooks(prev => [...prev, newBook]);
    return newBook;
  }, [setCustomBooks]);

  const removeCustomBook = useCallback((id: string) => {
    setCustomBooks(prev => prev.filter(b => b.id !== id));
  }, [setCustomBooks]);

  const addGeneratedBook = useCallback((book: GeneratedBook) => {
    setGeneratedBooks(prev => {
      // Check if book already exists by title
      const exists = prev.some(b => b.title.toLowerCase() === book.title.toLowerCase());
      if (exists) return prev;
      return [...prev, book];
    });
  }, [setGeneratedBooks]);

  const removeGeneratedBook = useCallback((id: string) => {
    setGeneratedBooks(prev => prev.filter(b => b.id !== id));
  }, [setGeneratedBooks]);

  const addUploadedBook = useCallback((book: GeneratedBook) => {
    setUploadedBooks(prev => {
      const exists = prev.some(b => b.title.toLowerCase() === book.title.toLowerCase());
      if (exists) return prev;
      
      // Try to save with full content
      try {
        const newBooks = [...prev, book];
        const serialized = JSON.stringify(newBooks);
        
        try {
          localStorage.setItem(STORAGE_KEYS.UPLOADED_BOOKS, serialized);
          return newBooks;
        } catch (storageError) {
          console.warn('localStorage full, saving without fullContent');
          // Save without fullContent if storage is full
          const bookWithoutContent: GeneratedBook = {
            ...book,
            fullContent: undefined
          };
          const reducedBooks = [...prev, bookWithoutContent];
          
          // Store fullContent separately in sessionStorage
          if (book.fullContent) {
            try {
              sessionStorage.setItem(`book-content-${book.id}`, JSON.stringify(book.fullContent));
            } catch (e) {
              console.error('Could not save book content', e);
            }
          }
          
          localStorage.setItem(STORAGE_KEYS.UPLOADED_BOOKS, JSON.stringify(reducedBooks));
          return reducedBooks;
        }
      } catch (e) {
        console.error('Error saving uploaded book', e);
        return prev;
      }
    });
  }, [setUploadedBooks]);

  const removeUploadedBook = useCallback((id: string) => {
    setUploadedBooks(prev => prev.filter(b => b.id !== id));
    // Also remove from sessionStorage
    sessionStorage.removeItem(`book-content-${id}`);
  }, [setUploadedBooks]);

  const getBookContent = useCallback((bookId: string): string[] | null => {
    // Try to get from sessionStorage first
    const sessionContent = sessionStorage.getItem(`book-content-${bookId}`);
    if (sessionContent) {
      try {
        return JSON.parse(sessionContent);
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  const getTotalHours = useCallback(() => {
    return studyHours.reduce((acc, h) => acc + h.minutes, 0) / 60;
  }, [studyHours]);

  const getWeeklyHours = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    return studyHours
      .filter(h => h.date >= weekAgoStr)
      .reduce((acc, h) => acc + h.minutes, 0) / 60;
  }, [studyHours]);

  const getTaskStats = useCallback(() => {
    let completed = 0;
    let total = 0;
    allProgress.forEach(p => {
      completed += p.tasks.filter(t => t.completed).length;
      total += p.tasks.length;
    });
    return { completed, total };
  }, [allProgress]);

  return {
    studyHours,
    streak,
    booksStudied,
    customBooks,
    generatedBooks,
    uploadedBooks,
    addStudyTime,
    markBookAsStudied,
    addCustomBook,
    removeCustomBook,
    addGeneratedBook,
    removeGeneratedBook,
    addUploadedBook,
    removeUploadedBook,
    getBookContent,
    getTotalHours,
    getWeeklyHours,
    getTaskStats,
  };
}
