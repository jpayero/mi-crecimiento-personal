'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Book } from '@/data/books';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, BookOpen, Home, Upload, Maximize, Minimize, Loader2, FileText, BookMarked, Menu } from 'lucide-react';

// Helper to get book content from sessionStorage
function getBookContentFromSession(bookId: string): string[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionContent = sessionStorage.getItem(`book-content-${bookId}`);
    if (sessionContent) {
      return JSON.parse(sessionContent);
    }
  } catch (e) {
    console.error('Error reading book content from session', e);
  }
  return null;
}

interface LeatherBookReaderProps {
  book: Book;
  onClose: () => void;
}

export function LeatherBookReader({ book, onClose }: LeatherBookReaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [bookTitle, setBookTitle] = useState(book.title);
  const [bookAuthor, setBookAuthor] = useState(book.author);
  const [showPageList, setShowPageList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageContentRef = useRef<HTMLDivElement>(null);
  
  // Initialize pages from book - priority: fullContent > sessionStorage > cards
  useEffect(() => {
    // First check if book has fullContent (for uploaded books)
    if (book.fullContent && book.fullContent.length > 0) {
      console.log('Using fullContent from book, pages:', book.fullContent.length);
      setPages(book.fullContent);
    } 
    // Check sessionStorage for content
    else {
      const sessionContent = getBookContentFromSession(book.id);
      if (sessionContent && sessionContent.length > 0) {
        console.log('Using content from sessionStorage, pages:', sessionContent.length);
        setPages(sessionContent);
      }
      // Fallback to cards if no fullContent
      else if (book.cards && book.cards.length > 0) {
        console.log('Using cards from book, cards:', book.cards.length);
        const cardPages = book.cards.map(card => 
          `${card.icon} ${card.title}\n\n${card.content}`
        );
        setPages(cardPages);
      }
    }
    
    setBookTitle(book.title);
    setBookAuthor(book.author);
    setCurrentPage(0);
  }, [book]);
  
  const totalPages = pages.length;
  
  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const handleOpenBook = () => {
    setIsOpen(true);
    setTimeout(() => {
      containerRef.current?.requestFullscreen();
    }, 100);
  };
  
  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);
  
  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);
  
  const goToPage = useCallback((pageIndex: number) => {
    setCurrentPage(Math.max(0, Math.min(pageIndex, totalPages - 1)));
    setShowPageList(false);
  }, [totalPages]);

  // Keyboard navigation - ONLY when book is open
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Stop propagation to prevent main page from handling
      e.stopPropagation();
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevPage();
          break;
        case 'ArrowRight':
          handleNextPage();
          break;
        case 'Escape':
          if (showPageList) {
            setShowPageList(false);
          } else if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            onClose();
          }
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, handlePrevPage, handleNextPage, onClose, toggleFullscreen, showPageList]);

  // Handle file upload - NO AI
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      
      const response = await fetch('/api/upload-book-direct', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el archivo');
      }
      
      // Set pages from full content
      if (data.book?.fullContent && Array.isArray(data.book.fullContent)) {
        // Save content to sessionStorage for this session
        try {
          sessionStorage.setItem(`book-content-${data.book.id}`, JSON.stringify(data.book.fullContent));
        } catch (e) {
          console.warn('Could not save to sessionStorage', e);
        }
        
        setPages(data.book.fullContent);
        setBookTitle(data.book.title);
        setBookAuthor(data.book.author || 'Desconocido');
        setCurrentPage(0);
        setIsOpen(true);
        setTimeout(() => {
          containerRef.current?.requestFullscreen();
        }, 100);
      } else if (data.book?.cards) {
        // Fallback to cards
        const cardPages = data.book.cards.map((card: { icon: string; title: string; content: string }) => 
          `${card.icon} ${card.title}\n\n${card.content}`
        );
        setPages(cardPages);
        setBookTitle(data.book.title);
        setBookAuthor(data.book.author || 'Desconocido');
        setCurrentPage(0);
        setIsOpen(true);
      }
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Closed book view (cover)
  if (!isOpen) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
      >
        {/* Close button */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:bg-slate-800 h-10 w-10"
        >
          <X className="h-6 w-6" />
        </Button>
        
        {/* Upload button */}
        <div className="absolute top-4 left-4 z-10">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.epub"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Subir Libro
              </>
            )}
          </Button>
        </div>
        
        {/* Upload error */}
        {uploadError && (
          <div className="absolute top-20 left-4 right-4 sm:left-auto sm:right-auto sm:w-96 bg-red-900/80 text-red-100 p-3 rounded-lg text-sm z-20">
            {uploadError}
            <Button variant="ghost" size="sm" onClick={() => setUploadError(null)} className="ml-2 text-red-200 h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Instructions */}
        <div className="absolute bottom-24 left-0 right-0 text-center px-4">
          <p className="text-slate-400 text-sm mb-2">
            Sube un libro (PDF, EPUB o TXT) para leerlo
          </p>
          <p className="text-slate-500 text-xs">
            Procesamiento local sin IA
          </p>
        </div>
        
        {/* Book Cover */}
        <div 
          className="relative cursor-pointer transform transition-all duration-500 hover:scale-105"
          onClick={handleOpenBook}
        >
          {/* Spine shadow */}
          <div className="absolute -left-4 top-2 bottom-2 w-8 bg-gradient-to-r from-black/50 to-transparent rounded-l-sm" />
          
          {/* Cover */}
          <div 
            className="relative w-72 h-96 sm:w-80 sm:h-[28rem] rounded-r-lg rounded-l-sm overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4a3728 0%, #2d1f15 50%, #1a120c 100%)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
            }}
          >
            {/* Leather texture */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
              }}
            />
            
            {/* Border */}
            <div className="absolute inset-4 border-2 border-amber-600/40 rounded" />
            
            {/* Corners */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-amber-500/60" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-amber-500/60" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-amber-500/60" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-amber-500/60" />
            
            {/* Title */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 text-5xl">📖</div>
              <h2 
                className="text-2xl sm:text-3xl font-serif font-bold mb-4 px-4"
                style={{ color: '#d4a574', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                {bookTitle}
              </h2>
              <p 
                className="text-lg italic"
                style={{ color: '#a67c52' }}
              >
                {bookAuthor}
              </p>
              
              <div className="mt-6 w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              
              <p className="mt-4 text-sm" style={{ color: '#8b6914' }}>
                {totalPages} páginas
              </p>
            </div>
            
            {/* Hint */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <div className="bg-amber-900/50 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse">
                <p className="text-amber-200 text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Clic para abrir
                </p>
              </div>
            </div>
          </div>
          
          {/* Pages effect */}
          <div className="absolute top-2 bottom-2 -right-1 w-3 bg-gradient-to-r from-amber-100 to-amber-50 rounded-r-sm" />
          <div className="absolute top-2 bottom-2 -right-2 w-2 bg-amber-200 rounded-r-sm" />
          <div className="absolute top-2 bottom-2 -right-3 w-1 bg-amber-300 rounded-r-sm" />
        </div>
      </div>
    );
  }

  // Open book view
  const currentPageContent = pages[currentPage] || '';
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-black/50 z-20 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-white hover:bg-slate-800"
          >
            <Home className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          <div className="text-white">
            <p className="text-sm font-medium truncate max-w-[150px] sm:max-w-none">{bookTitle}</p>
            <p className="text-xs opacity-70">
              Página {currentPage + 1} de {totalPages || 1}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Page list toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPageList(!showPageList)}
            className="text-white hover:bg-slate-800 h-9 w-9 sm:w-auto sm:px-3"
          >
            <Menu className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Índice</span>
          </Button>
          
          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.epub"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-white hover:bg-slate-800 h-9 w-9 sm:w-auto sm:px-3"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">Subir</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-slate-800 h-9 w-9"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Page list sidebar */}
      {showPageList && (
        <div className="absolute left-0 top-16 bottom-16 w-64 bg-slate-900/95 border-r border-slate-700 z-30 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-white font-semibold mb-2">Índice de Páginas</h3>
            <div className="space-y-1">
              {pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`
                    w-full text-left px-3 py-2 rounded text-sm transition-colors
                    ${index === currentPage 
                      ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50' 
                      : 'text-slate-300 hover:bg-slate-800'}
                  `}
                >
                  <span className="font-mono text-xs opacity-60 mr-2">{index + 1}</span>
                  {page.substring(0, 40)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-8 overflow-hidden relative">
        {/* Left arrow */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`
            absolute left-0 sm:left-4 z-30 p-3 sm:p-4 rounded-full transition-all
            ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/10 cursor-pointer'}
          `}
        >
          <ChevronLeft className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
        </button>
        
        {/* Right arrow */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className={`
            absolute right-0 sm:right-4 z-30 p-3 sm:p-4 rounded-full transition-all
            ${currentPage >= totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/10 cursor-pointer'}
          `}
        >
          <ChevronRight className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
        </button>
        
        {/* Book page */}
        <div 
          className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden shadow-2xl mx-8 sm:mx-0"
          style={{
            width: '100%',
            maxWidth: '600px',
            minHeight: '300px',
            maxHeight: '70vh',
          }}
        >
          {/* Paper texture */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
            }}
          />
          
          {/* Content */}
          <div ref={pageContentRef} className="relative p-4 sm:p-8 h-full overflow-y-auto" style={{ maxHeight: 'calc(70vh - 40px)' }}>
            {currentPageContent ? (
              <p className="text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-serif">
                {currentPageContent}
              </p>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BookMarked className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Sube un libro para comenzar a leer</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Page number */}
          <div className="text-center text-xs text-slate-400 py-2 border-t border-slate-200 bg-amber-50/50">
            {currentPage + 1}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="p-3 sm:p-4 bg-black/50 shrink-0">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <span className="text-slate-400 text-xs sm:text-sm">Progreso</span>
          <div className="w-32 sm:w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
              style={{ width: `${totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0}%` }}
            />
          </div>
          <span className="text-slate-400 text-xs sm:text-sm">
            {totalPages > 0 ? Math.round(((currentPage + 1) / totalPages) * 100) : 0}%
          </span>
        </div>
        <p className="text-center text-slate-500 text-xs mt-2">
          ← → Navegar | F Pantalla completa | ESC Salir
        </p>
      </div>
    </div>
  );
}
