'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  X, 
  File,
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface DirectBookUploaderProps {
  onBookGenerated: (book: unknown) => void;
  onClose: () => void;
}

export function DirectBookUploader({ onBookGenerated, onClose }: DirectBookUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
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

      const maxSize = 30 * 1024 * 1024; // 30MB
      if (selectedFile.size > maxSize) {
        setError('El archivo es muy grande. Máximo 30MB');
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
      setError('Por favor selecciona un archivo e ingresa el título');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setProcessingStatus('Leyendo archivo...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('author', author.trim() || 'Desconocido');

      setUploadProgress(20);
      setProcessingStatus('Extrayendo texto...');

      const response = await fetch('/api/upload-book-direct', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(50);
      setProcessingStatus('Procesando contenido...');

      const data = await response.json();

      setUploadProgress(80);
      setProcessingStatus('Generando páginas...');

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el libro');
      }

      setUploadProgress(100);
      setProcessingStatus('¡Completado!');
      setSuccess(true);
      
      // Save content to sessionStorage for the reader
      if (data.book?.fullContent && data.book?.id) {
        try {
          sessionStorage.setItem(`book-content-${data.book.id}`, JSON.stringify(data.book.fullContent));
          console.log('Saved book content to sessionStorage, pages:', data.book.fullContent.length);
        } catch (e) {
          console.warn('Could not save to sessionStorage', e);
        }
      }
      
      setTimeout(() => {
        onBookGenerated(data.book);
        onClose();
      }, 1200);

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
    <Card className="bg-slate-900/95 border-slate-700 w-full max-w-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Subir Libro
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
            <p className="text-white text-lg font-medium">¡Libro cargado!</p>
            <p className="text-slate-400 text-sm mt-1">{title}</p>
          </div>
        ) : (
          <>
            {/* Drop Zone */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-all duration-200
                ${file 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800/50'}
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
                  <FileText className="h-10 w-10 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">
                    Arrastra un archivo o haz clic aquí
                  </p>
                  <p className="text-slate-500 text-sm">
                    PDF, EPUB o TXT (máx. 30MB)
                  </p>
                </>
              )}
            </div>

            {/* Progress bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-slate-400 text-sm">{processingStatus}</p>
              </div>
            )}

            {/* Book Info */}
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-sm mb-1 block font-medium">Título del libro *</label>
                <Input
                  placeholder="Ej: El Principito"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={isUploading}
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block font-medium">Autor (opcional)</label>
                <Input
                  placeholder="Ej: Antoine de Saint-Exupéry"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <File className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-emerald-300 mb-1">Procesamiento Directo</p>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>• El texto se extrae directamente del archivo</li>
                  <li>• Se divide en páginas para lectura fácil</li>
                  <li>• No se usa inteligencia artificial</li>
                </ul>
              </div>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || !title.trim() || isUploading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-6"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {processingStatus}
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Subir y Procesar
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
