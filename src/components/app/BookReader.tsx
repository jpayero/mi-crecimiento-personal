'use client';

import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/data/books';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize
} from 'lucide-react';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
}

// Generate book content from cards
function generateBookContent(book: Book): string[] {
  const pages: string[] = [];
  
  // Title page
  pages.push(`
    <div class="text-center py-20">
      <div class="text-6xl mb-8">${book.cards[0]?.icon || '📖'}</div>
      <h1 class="text-4xl font-bold text-amber-200 mb-4">${book.title}</h1>
      <p class="text-xl text-slate-300 mb-8">por ${book.author}</p>
      <div class="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
      <p class="text-sm text-slate-400 mt-12">Una síntesis de conocimientos esenciales</p>
    </div>
  `);
  
  // Table of contents
  let tocContent = `
    <div class="py-12">
      <h2 class="text-2xl font-bold text-amber-200 mb-8 text-center">Contenido</h2>
      <div class="space-y-3">
  `;
  book.cards.forEach((card, index) => {
    tocContent += `
      <div class="flex items-center gap-3 text-slate-300 hover:text-amber-200 transition-colors">
        <span class="text-lg">${card.icon}</span>
        <span class="flex-1">${card.title}</span>
        <span class="text-slate-500">${(index + 3).toString().padStart(2, '0')}</span>
      </div>
    `;
  });
  tocContent += `</div></div>`;
  pages.push(tocContent);
  
  // Introduction
  pages.push(`
    <div class="py-12">
      <h2 class="text-2xl font-bold text-amber-200 mb-6">Introducción</h2>
      <p class="text-slate-300 leading-relaxed mb-4">
        ${book.title} es una obra que transforma la manera en que entendemos el desarrollo personal y profesional. 
        A través de sus páginas, el autor nos guía por un camino de descubrimiento y crecimiento.
      </p>
      <p class="text-slate-300 leading-relaxed mb-4">
        Este libro presenta conceptos fundamentales que, cuando se aplican consistentemente, 
        tienen el poder de cambiar vidas. Cada capítulo construye sobre el anterior, 
        creando una estructura sólida de conocimiento práctico.
      </p>
      <p class="text-slate-300 leading-relaxed">
        A continuación, encontrarás los conceptos clave extraídos de esta obra maestra, 
        presentados de forma clara y accionable para tu beneficio inmediato.
      </p>
    </div>
  `);
  
  // Content pages - each card gets detailed content
  book.cards.forEach((card, index) => {
    const pageNum = index + 4;
    pages.push(`
      <div class="py-12">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-4xl">${card.icon}</span>
          <h2 class="text-2xl font-bold text-amber-200">${card.title}</h2>
        </div>
        <p class="text-slate-300 leading-relaxed text-lg mb-6">
          ${card.content}
        </p>
        <div class="bg-slate-800/50 rounded-lg p-4 border-l-4 border-amber-400/50">
          <p class="text-slate-400 text-sm italic">
            "La clave para el éxito radica en la aplicación consistente de estos principios 
            en tu vida diaria. No basta con conocerlos; debes vivirlos."
          </p>
        </div>
        <div class="mt-8 flex items-center justify-between text-slate-500 text-sm">
          <span>Concepto ${index + 1} de ${book.cards.length}</span>
          <span>Página ${pageNum}</span>
        </div>
      </div>
    `);
  });
  
  // Conclusion
  pages.push(`
    <div class="py-12 text-center">
      <h2 class="text-2xl font-bold text-amber-200 mb-6">Conclusión</h2>
      <p class="text-slate-300 leading-relaxed mb-6">
        Has llegado al final de este viaje a través de ${book.title}. 
        Los conceptos que has descubierto aquí tienen el potencial de transformar tu vida 
        si decides ponerlos en práctica.
      </p>
      <p class="text-slate-300 leading-relaxed mb-6">
        Recuerda que el conocimiento sin acción es solo información. 
        El verdadero poder está en aplicar lo aprendido de forma consistente.
      </p>
      <div class="text-4xl mt-8">📚</div>
      <p class="text-slate-400 text-sm mt-4">Fin del libro</p>
    </div>
  `);
  
  return pages;
}

export function BookReader({ book, onClose }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  
  useEffect(() => {
    setPages(generateBookContent(book));
  }, [book]);
  
  const totalPages = pages.length;
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 2;
  
  const goPrev = useCallback(() => {
    if (canGoPrev) setCurrentPage(p => Math.max(0, p - 2));
  }, [canGoPrev]);
  
  const goNext = useCallback(() => {
    if (canGoNext) setCurrentPage(p => Math.min(totalPages - 2, p + 2));
  }, [canGoNext, totalPages]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext, onClose]);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const leftPage = pages[currentPage];
  const rightPage = pages[currentPage + 1];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-amber-400" />
          <span className="text-white font-medium">{book.title}</span>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">
            {book.author}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Font controls */}
          <div className="flex items-center gap-1 mr-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(f => Math.max(12, f - 2))}
              className="text-slate-400 hover:text-white h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-slate-400 text-sm w-8 text-center">{fontSize}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(f => Math.min(24, f + 2))}
              className="text-slate-400 hover:text-white h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Page indicator */}
          <span className="text-slate-400 text-sm mr-4">
            Páginas {currentPage + 1}-{Math.min(currentPage + 2, totalPages)} de {totalPages}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Book Container */}
      <main className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="lg"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="absolute left-0 z-10 h-full w-16 text-slate-400 hover:text-white hover:bg-slate-800/30 disabled:opacity-30 rounded-none"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          {/* Book Pages */}
          <div className="flex gap-0 h-[85vh] max-h-[800px] shadow-2xl">
            {/* Left Page */}
            <div 
              className="w-[400px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-l-lg border-r border-amber-200 shadow-inner overflow-hidden relative"
              style={{ fontSize: `${fontSize}px` }}
            >
              {/* Page shadow effect */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-200/50 to-transparent" />
              
              {/* Page content */}
              <div 
                className="p-8 h-full overflow-y-auto text-slate-800"
                dangerouslySetInnerHTML={{ __html: leftPage || '<div class="flex items-center justify-center h-full text-slate-400">Página vacía</div>' }}
              />
              
              {/* Page number */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-amber-400 text-sm">
                {currentPage + 1}
              </div>
              
              {/* Page curl effect */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-amber-200 to-transparent rounded-tl-full" />
            </div>
            
            {/* Book Spine */}
            <div className="w-4 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-800 shadow-inner relative">
              <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            </div>
            
            {/* Right Page */}
            <div 
              className="w-[400px] bg-gradient-to-bl from-amber-50 to-orange-50 rounded-r-lg border-l border-amber-200 shadow-inner overflow-hidden relative"
              style={{ fontSize: `${fontSize}px` }}
            >
              {/* Page shadow effect */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-200/50 to-transparent" />
              
              {/* Page content */}
              <div 
                className="p-8 h-full overflow-y-auto text-slate-800"
                dangerouslySetInnerHTML={{ __html: rightPage || '<div class="flex items-center justify-center h-full text-slate-400">Página vacía</div>' }}
              />
              
              {/* Page number */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-amber-400 text-sm">
                {Math.min(currentPage + 2, totalPages)}
              </div>
              
              {/* Page curl effect */}
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-200 to-transparent rounded-tr-full" />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={goNext}
            disabled={!canGoNext}
            className="absolute right-0 z-10 h-full w-16 text-slate-400 hover:text-white hover:bg-slate-800/30 disabled:opacity-30 rounded-none"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="px-6 py-2 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 flex items-center justify-center gap-4">
        <span className="text-slate-400 text-sm">
          Usa las flechas ← → para navegar
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 text-sm">
          Presiona ESC para salir
        </span>
      </footer>
    </div>
  );
}
