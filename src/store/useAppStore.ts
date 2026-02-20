'use client';

import { create } from 'zustand';
import { Book, Category } from '@/data/books';

interface AppState {
  selectedBook: Book | null;
  currentCardIndex: number;
  isFullscreen: boolean;
  showDashboard: boolean;
  showNotes: boolean;
  selectedCategory: Category | 'all';

  setSelectedBook: (book: Book | null) => void;
  setCurrentCardIndex: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  toggleFullscreen: () => void;
  setShowDashboard: (show: boolean) => void;
  setShowNotes: (show: boolean) => void;
  setSelectedCategory: (category: Category | 'all') => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedBook: null,
  currentCardIndex: 0,
  isFullscreen: false,
  showDashboard: false,
  showNotes: false,
  selectedCategory: 'all',

  setSelectedBook: (book) => set({ selectedBook: book, currentCardIndex: 0 }),
  setCurrentCardIndex: (index) => set({ currentCardIndex: index }),
  nextCard: () => set((state) => {
    if (state.selectedBook) {
      const maxIndex = Math.max(0, state.selectedBook.cards.length - 4);
      return { currentCardIndex: Math.min(state.currentCardIndex + 1, maxIndex) };
    }
    return state;
  }),
  prevCard: () => set((state) => ({
    currentCardIndex: Math.max(0, state.currentCardIndex - 1)
  })),
  toggleFullscreen: () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        set({ isFullscreen: true });
      } else {
        document.exitFullscreen();
        set({ isFullscreen: false });
      }
    }
  },
  setShowDashboard: (show) => set({ showDashboard: show, showNotes: false }),
  setShowNotes: (show) => set({ showNotes: show }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
