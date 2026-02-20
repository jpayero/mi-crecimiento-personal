'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  X, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface BookUploaderProps {
  onBookGenerated: (book: unknown) => void;
  onClose: () => void;
}

export function BookUploader({ onBookGenerated, onClose }: BookUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain', 'application/epub+zip'];
      const isValidType = validTypes.includes(selectedFile.type) || 
                          selectedFile.name.endsWith('.txt') || 
                          selectedFile.name.endsWith('.pdf') ||
                          selectedFile.name.endsWith('.epub');
      
      if (!isValidType) {
        setError('Formato no soportado. Usa PDF, EPUB o TXT');
        return;
      }

      const maxSize = selectedFile.name.endsWith('.epub') ? 15 * 1024 * 1024 : 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('El archivo es muy grande. Maximo 15MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
      
      if (!title) {
        const fileName = selectedFile.name.replace(/\.(pdf|txt|epub)$/i, '');
        setTitle(fileName);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError('Por favor ingresa el titulo del libro');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('author', author.trim() || 'Desconocido');

      const response = await fetch('/api/upload-book', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el libro');
      }

      setSuccess(true);
      
      setTimeout(() => {
        onBookGenerated(data.book);
        onClose();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const fakeEvent = {
        target: { files: [droppedFile] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  return (
    <Card className="bg-slate-900/95 border-slate-700 w-full max-w-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-purple-400" />
            Cargar Libro Local
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {success ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-400 mb-4" />
            <p className="text-white text-lg font-medium">Libro analizado exitosamente</p>
            <p className="text-slate-400 text-sm mt-1">Generando tarjetas con Gemini...</p>
          </div>
        ) : (
          <>
            {/* Drop Zone */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                transition-all duration-200
                ${file 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'}
              `}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.epub"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-purple-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-300 font-medium">
                    Arrastra un archivo o haz clic aqui
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    PDF, EPUB o TXT (max 15MB)
                  </p>
                </>
              )}
            </div>

            {/* Book Info */}
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Titulo del libro *</label>
                <Input
                  placeholder="Ej: Atomic Habits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Autor (opcional)</label>
                <Input
                  placeholder="Ej: James Clear"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Sparkles className="h-4 w-4 text-purple-400 mt-0.5" />
              <p className="text-slate-300 text-xs">
                <strong className="text-purple-300">Gemini AI</strong> analizara tu libro y generara 20-30 tarjetas con todos los conceptos clave, ideas principales y tareas practicas.
              </p>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || !title.trim() || isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analizando con Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analizar Libro
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
