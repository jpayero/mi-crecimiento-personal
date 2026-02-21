'use client';

import { useState } from 'react';
import { books, categoryConfig, Category, Book } from '@/data/books';
import { suggestedBooks, SuggestedBook } from '@/data/suggestedBooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  X, 
  Upload,
  Star,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useGrowth, GeneratedBook } from '@/hooks/useLocalStorage';
import { DirectBookUploader } from './DirectBookUploader';

type ViewMode = 'library' | 'suggested';

export function BookList() {
  const { selectedBook, setSelectedBook, selectedCategory, setSelectedCategory } = useAppStore();
  const { 
    customBooks, 
    removeCustomBook, 
    generatedBooks, 
    removeGeneratedBook,
    uploadedBooks,
    addUploadedBook,
    removeUploadedBook
  } = useGrowth();
  
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [showUploader, setShowUploader] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(b => b.category === selectedCategory);

  // Combine all books: predefined + uploaded + generated + custom
  const allBooks = [
    ...filteredBooks,
    ...uploadedBooks,
    ...generatedBooks,
    ...customBooks.map(b => ({
      ...b,
      category: 'desarrollo-personal' as Category,
      cards: [],
      tasks: []
    }))
  ];

  // Group suggested books by category
  const groupedSuggested = suggestedBooks.reduce((acc, book) => {
    if (!acc[book.category]) acc[book.category] = [];
    acc[book.category].push(book);
    return acc;
  }, {} as Record<string, SuggestedBook[]>);

  const handleUploadedBook = (book: unknown) => {
    addUploadedBook(book as GeneratedBook);
    setSelectedBook(book as Book);
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

  return (
    <Card className="bg-slate-900/80 border-slate-700 h-full flex flex-col">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
          Biblioteca
        </CardTitle>
        
        {/* View Mode Tabs */}
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
          {[
            { mode: 'library' as ViewMode, icon: BookOpen, label: 'Mi Librería' },
            { mode: 'suggested' as ViewMode, icon: Star, label: 'Sugeridos' },
          ].map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(mode)}
              className={`h-7 px-2 text-xs ${
                viewMode === mode 
                  ? 'bg-purple-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1 mt-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className={`
                cursor-pointer text-[10px] sm:text-xs py-0.5
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
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden p-2">
        {/* Library View */}
        {viewMode === 'library' && (
          <>
            {/* Upload Button */}
            <Button
              onClick={() => setShowUploader(true)}
              variant="outline"
              className="w-full mb-2 border-dashed border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 h-9"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Libro (PDF/EPUB/TXT)
            </Button>

            <p className="text-[10px] text-slate-500 text-center mb-2">
              Procesamiento local sin IA
            </p>

            <ScrollArea className="flex-1 pr-1">
              <div className="space-y-1.5">
                {allBooks.map((book) => {
                  const config = 'category' in book && book.category 
                    ? categoryConfig[book.category] 
                    : categoryConfig['desarrollo-personal'];
                  const isSelected = selectedBook?.id === book.id;
                  const isCustom = book.id.startsWith('custom-');
                  const isGenerated = book.id.startsWith('generated-');
                  const isUploaded = book.id.startsWith('uploaded-') || book.id.startsWith('book-');
                  
                  return (
                    <div
                      key={book.id}
                      className={`
                        p-2 sm:p-3 rounded-lg cursor-pointer transition-all
                        ${isSelected 
                          ? `bg-gradient-to-r ${config.gradient} border ${config.border}` 
                          : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'}
                      `}
                      onClick={() => setSelectedBook(book as Book)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className={`font-medium text-xs sm:text-sm truncate ${
                              isSelected ? config.color : 'text-white'
                            }`}>
                              {book.title}
                            </h3>
                            {isUploaded && (
                              <FileText className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] sm:text-xs text-slate-400 truncate">{book.author}</p>
                          {'cards' in book && book.cards && book.cards.length > 0 && (
                            <Badge 
                              variant="outline" 
                              className={`mt-1 text-[10px] ${config.color} border-current`}
                            >
                              {book.cards.length} tarjetas
                            </Badge>
                          )}
                        </div>
                        {(isCustom || isGenerated || isUploaded) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-slate-500 hover:text-red-400 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isUploaded) removeUploadedBook(book.id);
                              else if (isGenerated) removeGeneratedBook(book.id);
                              else removeCustomBook(book.id);
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
          </>
        )}

        {/* Suggested Books View */}
        {viewMode === 'suggested' && (
          <ScrollArea className="flex-1 pr-1">
            <div className="space-y-3">
              {Object.entries(groupedSuggested).map(([category, categoryBooks]) => {
                const config = categoryConfig[category as Category];
                const isExpanded = expandedCategory === category;
                const displayBooks = isExpanded ? categoryBooks : categoryBooks.slice(0, 3);
                
                return (
                  <div key={category} className="space-y-1">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                    >
                      <Badge className={`${config.color} bg-transparent border-current`}>
                        {config.name}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {displayBooks.map((book) => (
                        <div
                          key={book.id}
                          className="p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800 cursor-pointer border border-slate-700/50"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{book.coverEmoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-medium truncate">{book.title}</p>
                              <p className="text-slate-400 text-[10px]">{book.author} • {book.year}</p>
                              <p className="text-slate-500 text-[10px] mt-1 line-clamp-2">{book.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <DirectBookUploader
            onBookGenerated={handleUploadedBook}
            onClose={() => setShowUploader(false)}
          />
        </div>
      )}
    </Card>
  );
}
