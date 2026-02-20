'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { books, categoryConfig } from '@/data/books';
import { BookListSidebar } from '@/components/app/BookListSidebar';
import { TaskList } from '@/components/app/TaskList';
import { KanbanGrid } from '@/components/app/KanbanCard';
import { GrowthDashboard } from '@/components/app/GrowthDashboard';
import { NotesPanel } from '@/components/app/NotesPanel';
import { ExportPanel } from '@/components/app/ExportPanel';
import { LeatherBookReader } from '@/components/app/LeatherBookReader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useGrowth } from '@/hooks/useLocalStorage';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  BarChart3,
  FileText,
  Sparkles,
  BookOpen,
  X,
  LayoutList,
  BookText,
  ArrowLeft
} from 'lucide-react';

// Mobile Navigation Component
function MobileNav({ 
  currentSet, 
  totalSets, 
  prevCard, 
  nextCard, 
  currentCardIndex, 
  maxIndex,
  selectedBook,
  onOpenLibrary
}: { 
  currentSet: number; 
  totalSets: number; 
  prevCard: () => void; 
  nextCard: () => void;
  currentCardIndex: number;
  maxIndex: number;
  selectedBook: typeof books[0] | null;
  onOpenLibrary: () => void;
}) {
  return (
    <header className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        {/* Tasks Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 border-slate-700">
              <LayoutList className="h-4 w-4 mr-1" />
              Tareas
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 bg-slate-900 border-slate-700">
            {selectedBook && <TaskList book={selectedBook} />}
          </SheetContent>
        </Sheet>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="border-slate-700 h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-slate-400 px-2">
            {currentSet}/{totalSets}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextCard}
            disabled={currentCardIndex >= maxIndex}
            className="border-slate-700 h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Library Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 border-slate-700"
          onClick={onOpenLibrary}
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Libros
        </Button>
      </div>
    </header>
  );
}

export default function Home() {
  const {
    selectedBook,
    setSelectedBook,
    currentCardIndex,
    nextCard,
    prevCard,
    isFullscreen,
    toggleFullscreen,
    showDashboard,
    setShowDashboard,
    showNotes,
    setShowNotes
  } = useAppStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBookReader, setShowBookReader] = useState(false);
  const { addStudyTime } = useGrowth();
  const gridRef = useRef<HTMLDivElement>(null);
  const studyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-select first book on mount
  useEffect(() => {
    if (!selectedBook && books.length > 0) {
      setSelectedBook(books[0]);
    }
  }, [selectedBook, setSelectedBook]);

  // Track study time
  useEffect(() => {
    if (selectedBook) {
      studyIntervalRef.current = setInterval(() => {
        addStudyTime(1);
      }, 60000);
    }

    return () => {
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
      }
    };
  }, [selectedBook, addStudyTime]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDashboard || showNotes || showBookReader) return;

      switch (e.key) {
        case 'ArrowLeft':
          prevCard();
          break;
        case 'ArrowRight':
          nextCard();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevCard, nextCard, toggleFullscreen, showDashboard, showNotes, isFullscreen, showBookReader]);

  // Calculate visible cards
  const visibleCards = selectedBook 
    ? selectedBook.cards.slice(currentCardIndex, currentCardIndex + 4)
    : [];
  
  const totalCards = selectedBook?.cards.length || 0;
  const maxIndex = Math.max(0, totalCards - 4);
  const currentSet = Math.floor(currentCardIndex / 4) + 1;
  const totalSets = Math.ceil(totalCards / 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Mi Crecimiento Personal
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {selectedBook && (
              <Badge 
                variant="outline"
                className={`${categoryConfig[selectedBook.category].color} border-current text-sm px-3 py-1`}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                {selectedBook.title}
                <span className="ml-2 text-xs opacity-70">({selectedBook.cards.length} tarjetas)</span>
              </Badge>
            )}

            <ExportPanel
              book={selectedBook}
              visibleCards={visibleCards}
              gridRef={gridRef}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBookReader(true)}
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              <BookText className="h-4 w-4 mr-1" />
              Leer Libro
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className={`${showNotes ? 'bg-yellow-600 border-yellow-500' : 'border-slate-600'} text-white`}
            >
              <FileText className="h-4 w-4 mr-1" />
              Apuntes
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
              className={`${showDashboard ? 'bg-purple-600 border-purple-500' : 'border-slate-600'} text-white`}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Dashboard
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-slate-600 text-white"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mi Crecimiento
            </h1>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBookReader(true)}
              className="text-amber-400 h-8 w-8 p-0"
            >
              <BookText className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
              className="text-slate-400 h-8 w-8 p-0"
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="text-slate-400 h-8 w-8 p-0"
            >
              <FileText className="h-5 w-5" />
            </Button>
            <ExportPanel
              book={selectedBook}
              visibleCards={visibleCards}
              gridRef={gridRef}
            />
          </div>
        </div>
      </header>

      {/* Main Content - Desktop */}
      <main className="hidden lg:flex pt-16 h-screen">
        {/* Left Column - Task List */}
        <aside className="w-72 xl:w-80 flex-shrink-0 border-r border-slate-800 p-3 xl:p-4 overflow-hidden">
          {selectedBook ? (
            <TaskList book={selectedBook} />
          ) : (
            <div className="bg-slate-900/80 border border-slate-700 h-full flex items-center justify-center rounded-lg">
              <p className="text-slate-400 text-center p-4">
                Selecciona un libro para ver las tareas
              </p>
            </div>
          )}
        </aside>

        {/* Center Column - Kanban Cards with Navigation */}
        <section className="flex-1 p-4 overflow-hidden flex flex-col relative">
          {selectedBook ? (
            <>
              {/* Navigation Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-white">
                    Conocimientos Clave
                  </h2>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                    Set {currentSet} de {totalSets}
                  </Badge>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalSets, 10) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentSet - 1
                          ? 'bg-purple-500 w-4'
                          : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Kanban Grid with Large Navigation Arrows */}
              <div className="flex-1 overflow-hidden relative flex items-center">
                {/* Left Navigation Arrow */}
                <button
                  onClick={prevCard}
                  disabled={currentCardIndex === 0}
                  className={`
                    absolute left-0 z-20 p-4 rounded-r-xl transition-all duration-200
                    flex items-center justify-center
                    ${currentCardIndex === 0 
                      ? 'opacity-30 cursor-not-allowed bg-slate-800/30' 
                      : 'opacity-100 hover:bg-purple-600/30 cursor-pointer bg-slate-800/50 hover:scale-110'}
                  `}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronLeft className="h-10 w-10 text-white" />
                </button>
                
                {/* Right Navigation Arrow */}
                <button
                  onClick={nextCard}
                  disabled={currentCardIndex >= maxIndex}
                  className={`
                    absolute right-0 z-20 p-4 rounded-l-xl transition-all duration-200
                    flex items-center justify-center
                    ${currentCardIndex >= maxIndex 
                      ? 'opacity-30 cursor-not-allowed bg-slate-800/30' 
                      : 'opacity-100 hover:bg-purple-600/30 cursor-pointer bg-slate-800/50 hover:scale-110'}
                  `}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronRight className="h-10 w-10 text-white" />
                </button>
                
                {/* Cards Grid */}
                <div ref={gridRef} className="flex-1 h-full px-12">
                  <KanbanGrid
                    cards={visibleCards}
                    category={selectedBook.category}
                    currentIndex={currentCardIndex}
                  />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-400">
                <span>← → Navegar</span>
                <span>|</span>
                <span>Flechas del teclado</span>
              </div>
            </>
          ) : (
            <div className="bg-slate-900/80 border border-slate-700 h-full flex flex-col items-center justify-center rounded-lg">
              <BookOpen className="h-16 w-16 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg text-center px-4">
                Selecciona un libro para comenzar
              </p>
            </div>
          )}
        </section>

        {/* Right Column - Movable Sidebar */}
        <BookListSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
      </main>

      {/* Main Content - Mobile/Tablet */}
      <main className="lg:hidden pt-14 pb-16 h-screen overflow-hidden">
        {selectedBook ? (
          <div className="h-full flex flex-col p-1.5 sm:p-2">
            {/* Book title */}
            <div className="text-center mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm text-slate-400 truncate">{selectedBook.author}</p>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">{selectedBook.title}</h2>
              <Badge variant="secondary" className="bg-purple-600/30 text-purple-300 text-[10px] mt-1">
                {selectedBook.cards.length} tarjetas
              </Badge>
            </div>

            {/* Kanban Cards - Mobile with large navigation */}
            <div className="flex-1 overflow-hidden relative flex items-center">
              {/* Left Navigation */}
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className={`
                  absolute left-0 z-20 p-3 rounded-r-lg transition-all
                  ${currentCardIndex === 0 
                    ? 'opacity-20 cursor-not-allowed' 
                    : 'opacity-80 hover:opacity-100 cursor-pointer bg-slate-800/60'}
                `}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              
              {/* Right Navigation */}
              <button
                onClick={nextCard}
                disabled={currentCardIndex >= maxIndex}
                className={`
                  absolute right-0 z-20 p-3 rounded-l-lg transition-all
                  ${currentCardIndex >= maxIndex 
                    ? 'opacity-20 cursor-not-allowed' 
                    : 'opacity-80 hover:opacity-100 cursor-pointer bg-slate-800/60'}
                `}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
              
              <div 
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-1 sm:p-2 h-full w-full px-10"
              >
                {visibleCards.slice(0, 2).map((card, index) => (
                  <div key={card.id} className="h-full">
                    <div 
                      className={`
                        bg-gradient-to-br ${
                          index === 0 
                            ? 'from-amber-500/40 via-orange-400/30 to-yellow-500/35' 
                            : 'from-emerald-500/40 via-teal-400/30 to-cyan-500/35'
                        }
                        border-2 ${
                          index === 0 ? 'border-amber-400/80' : 'border-emerald-400/80'
                        }
                        backdrop-blur-md rounded-lg
                        shadow-xl ${
                          index === 0 ? 'shadow-[0_0_30px_rgba(251,191,36,0.3)]' : 'shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                        }
                        h-full flex flex-col p-3 sm:p-4
                        relative overflow-hidden
                      `}
                    >
                      <div className={`absolute top-2 right-2 text-[9px] font-mono ${index === 0 ? 'text-amber-200' : 'text-emerald-200'} opacity-60 bg-black/20 px-2 py-0.5 rounded-full`}>
                        #{(currentCardIndex + index + 1).toString().padStart(2, '0')}
                      </div>
                      
                      <div className="flex items-start gap-2 mb-1.5 sm:mb-2">
                        <span className="text-xl sm:text-2xl drop-shadow-lg flex-shrink-0">{card.icon}</span>
                        <h3 className={`${index === 0 ? 'text-amber-200' : 'text-emerald-200'} font-bold text-xs sm:text-sm leading-tight`}>
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-gray-100/90 text-[11px] sm:text-xs leading-relaxed flex-1">
                        {card.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1 py-2">
              {Array.from({ length: Math.min(totalSets, 8) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentSet - 1 ? 'bg-purple-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Abre la biblioteca para seleccionar un libro</p>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        currentSet={currentSet}
        totalSets={totalSets}
        prevCard={prevCard}
        nextCard={nextCard}
        currentCardIndex={currentCardIndex}
        maxIndex={maxIndex}
        selectedBook={selectedBook}
        onOpenLibrary={() => setSidebarOpen(true)}
      />

      {/* Dashboard Overlay - with large close button */}
      {showDashboard && (
        <div className="fixed inset-0 z-50 bg-slate-950">
          {/* Large close button - always visible */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <Button
              variant="default"
              size="lg"
              onClick={() => setShowDashboard(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver a Lectura
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDashboard(false)}
              className="text-white hover:bg-slate-800 h-10 w-10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="pt-20 h-full overflow-auto">
            <GrowthDashboard />
          </div>
        </div>
      )}

      {/* Notes Panel Overlay */}
      {showNotes && selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl h-[80vh]">
            <NotesPanel book={selectedBook} onClose={() => setShowNotes(false)} />
          </div>
        </div>
      )}

      {/* Book Reader - Leather Style */}
      {showBookReader && selectedBook && (
        <LeatherBookReader book={selectedBook} onClose={() => setShowBookReader(false)} />
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        /* Hide scrollbar on mobile */
        @media (max-width: 1023px) {
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
