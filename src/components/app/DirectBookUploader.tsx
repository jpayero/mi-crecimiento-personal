'use client';

import { useState, useRef, useCallback } from 'react';
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

// Extract text from PDF using PDF.js on client side ONLY (dynamic import to avoid SSR issues)
async function extractPdfTextClientSide(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction only works in browser');
  }
  
  // Dynamically import PDF.js only when needed (client-side only)
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker source from CDN
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const numPages = pdf.numPages;
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Extract text from items that have 'str' property (TextItem)
    const pageText = textContent.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ');
    
    fullText += pageText + '\n\n';
  }
  
  return fullText.trim();
}

// Extract text from EPUB using JSZip on client side
async function extractEpubTextClientSide(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('EPUB extraction only works in browser');
  }
  
  const JSZip = (await import('jszip')).default;
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  let text = '';
  
  const htmlFiles = Object.keys(zip.files).filter(
    name => name.endsWith('.html') || name.endsWith('.xhtml') || name.endsWith('.htm')
  );
  
  htmlFiles.sort();
  
  for (const fileName of htmlFiles.slice(0, 200)) {
    const content = await zip.file(fileName)?.async('text');
    if (content) {
      const plainText = content
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<[^>]+>/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (plainText.length > 20) {
        text += plainText + '\n\n';
      }
    }
  }
  
  return text;
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

  const handleUpload = useCallback(async () => {
    if (!file || !title.trim()) {
      setError('Por favor selecciona un archivo e ingresa el título');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setProcessingStatus('Leyendo archivo...');

    try {
      let extractedText = '';
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isEPUB = file.name.toLowerCase().endsWith('.epub') || file.type === 'application/epub+zip';
      const isTXT = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

      setUploadProgress(10);

      // Extract text client-side
      if (isPDF) {
        setProcessingStatus('Extrayendo texto del PDF...');
        try {
          extractedText = await extractPdfTextClientSide(file);
          console.log('PDF extracted text length:', extractedText.length);
        } catch (pdfError) {
          console.error('PDF extraction error:', pdfError);
          setError('No se pudo extraer el texto del PDF. Intenta con un archivo TXT o EPUB.');
          setIsUploading(false);
          return;
        }
      } else if (isEPUB) {
        setProcessingStatus('Extrayendo texto del EPUB...');
        try {
          extractedText = await extractEpubTextClientSide(file);
          console.log('EPUB extracted text length:', extractedText.length);
        } catch (epubError) {
          console.error('EPUB extraction error:', epubError);
          setError('No se pudo extraer el texto del EPUB. Intenta con otro archivo.');
          setIsUploading(false);
          return;
        }
      } else if (isTXT) {
        setProcessingStatus('Leyendo archivo de texto...');
        extractedText = await file.text();
      }

      setUploadProgress(40);
      setProcessingStatus('Procesando contenido...');

      if (!extractedText.trim() || extractedText.length < 100) {
        setError('No se pudo extraer suficiente texto del archivo. Intenta con otro archivo.');
        setIsUploading(false);
        return;
      }

      // Send extracted text to server for processing
      const formData = new FormData();
      formData.append('extractedText', extractedText);
      formData.append('title', title.trim());
      formData.append('author', author.trim() || 'Desconocido');
      formData.append('fileType', isPDF ? 'pdf' : isEPUB ? 'epub' : 'txt');

      setUploadProgress(60);
      setProcessingStatus('Generando páginas y tarjetas...');

      const response = await fetch('/api/upload-book-direct', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      const data = await response.json();

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
  }, [file, title, author, onBookGenerated, onClose]);

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
            <p className="text-emerald-400 text-xs mt-2">{uploadProgress}% completado</p>
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
                <p className="font-medium text-emerald-300 mb-1">Extracción Local de Texto</p>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>• El PDF se procesa en tu navegador</li>
                  <li>• Se extrae el texto real, no símbolos</li>
                  <li>• Genera 30+ tarjetas de resumen</li>
                  <li>• División en páginas para lectura fácil</li>
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
