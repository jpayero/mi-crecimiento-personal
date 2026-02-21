'use client';

import { useState, useRef, useEffect } from 'react';
import { books, categoryConfig, Category, Book } from '@/data/books';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  X, 
  Upload,
  GripVertical,
  PanelLeftClose,
  PanelLeft,
  FileText
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useGrowth, GeneratedBook } from '@/hooks/useLocalStorage';
import { DirectBookUploader } from './DirectBookUploader';

type ViewMode = 'library' | 'upload';

interface BookListSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BookListSidebar({ isOpen, onToggle }: BookListSidebarProps) {
  const { selectedBook, setSelectedBook, selectedCategory, setSelectedCategory } = useAppStore();
  const { 
    uploadedBooks,
    addUploadedBook,
    removeUploadedBook
  } = useGrowth();
  
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [showUploader, setShowUploader] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle resize
  const startResizing = () => setIsResizing(true);
  
  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    const resize = (e: MouseEvent) => {
      if (isResizing && e.clientX > 250 && e.clientX < 500) {
        setSidebarWidth(e.clientX);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResizing);
    }

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(b => b.category === selectedCategory);

  const allBooks = [
    ...filteredBooks,
    ...uploadedBooks
  ];

  const handleUploadedBook = (book: unknown) => {
    const typedBook = book as GeneratedBook;
    console.log('Uploading book with fullContent:', typedBook.fullContent?.length, 'pages');
    addUploadedBook(typedBook);
    setSelectedBook(typedBook as Book);
    setShowUploader(false);
  };

  const categories: (Category | 'all')[] = [
    'all',
    'riqueza',
    'desarrollo-personal',
    'psicologia-negocios',
    'emprendimiento',
    'historias-exito',
    'coaching',
    'gerencia',
    'manejo-proyectos'
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        className="fixed right-4 top-20 z-50 bg-purple-600/90 border-purple-500 text-white hover:bg-purple-700"
      >
        <PanelLeft className="h-4 w-4 mr-2" />
        Biblioteca
      </Button>
    );
  }

  return (
    <div 
      ref={sidebarRef}
      className="h-full flex flex-col bg-slate-900/95 border-l border-slate-700 relative"
      style={{ width: `${sidebarWidth}px`, minWidth: '280px', maxWidth: '500px' }}
    >
      {/* Resize handle */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-purple-500/30 transition-colors flex items-center justify-center group"
        onMouseDown={startResizing}
      >
        <GripVertical className="h-8 w-4 text-slate-600 group-hover:text-purple-400" />
      </div>

      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white text-base font-semibold">
          <BookOpen className="h-5 w-5 text-purple-400" />
          Biblioteca
          <Badge variant="secondary" className="bg-purple-600/30 text-purple-300 text-xs">
            {allBooks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-700/50">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className={`
              cursor-pointer text-[10px] py-0.5 px-2
              ${selectedCategory === cat 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'border-slate-600 text-slate-400 hover:bg-slate-800'}
            `}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'Todos' : categoryConfig[cat]?.name.slice(0, 10)}
          </Badge>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'library' && (
          <div className="h-full flex flex-col">
            {/* Upload Button */}
            <div className="p-2">
              <Button
                onClick={() => setShowUploader(true)}
                variant="outline"
                className="w-full border-dashed border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 h-9"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Libro (PDF/EPUB/TXT)
              </Button>
            </div>
            
            <p className="text-[10px] text-slate-500 px-2 text-center mb-2">
              El libro se procesa localmente sin usar IA
            </p>

            <ScrollArea className="flex-1 px-2 pb-2">
              <div className="space-y-1.5">
                {allBooks.map((book) => {
                  const config = 'category' in book && book.category 
                    ? categoryConfig[book.category] 
                    : categoryConfig['desarrollo-personal'];
                  const isSelected = selectedBook?.id === book.id;
                  const isUploaded = book.id.startsWith('book-') || book.id.startsWith('uploaded-');
                  
                  return (
                    <div
                      key={book.id}
                      className={`
                        p-2.5 rounded-lg cursor-pointer transition-all
                        ${isSelected 
                          ? `bg-gradient-to-r ${config.gradient} border ${config.border}` 
                          : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'}
                      `}
                      onClick={() => setSelectedBook(book as Book)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className={`font-medium text-sm truncate ${
                              isSelected ? config.color : 'text-white'
                            }`}>
                              {book.title}
                            </h3>
                            {isUploaded && (
                              <FileText className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
                          {'cards' in book && book.cards && (
                            <Badge 
                              variant="outline" 
                              className={`mt-1 text-[9px] ${config.color} border-current`}
                            >
                              {book.cards.length} tarjetas
                            </Badge>
                          )}
                        </div>
                        {isUploaded && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-slate-500 hover:text-red-400 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeUploadedBook(book.id);
                              if (selectedBook?.id === book.id) setSelectedBook(null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <DirectBookUploader
            onBookGenerated={handleUploadedBook}
            onClose={() => setShowUploader(false)}
          />
        </div>
      )}
    </div>
  );
}
