import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
// @ts-expect-error - pdf2json types
import PDFParser from 'pdf2json';

interface BookSection {
  title: string;
  content: string;
  icon: string;
}

interface GeneratedCard {
  id: string;
  title: string;
  content: string;
  icon: string;
}

// Extract text from PDF using pdf2json
async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      console.error('PDF parsing error:', errData.parserError);
      reject(new Error(errData.parserError));
    });
    
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        let fullText = '';
        
        // Extract text from all pages
        if (pdfData?.Pages && Array.isArray(pdfData.Pages)) {
          for (const page of pdfData.Pages) {
            if (page?.Texts && Array.isArray(page.Texts)) {
              for (const text of page.Texts) {
                if (text?.R && Array.isArray(text.R)) {
                  for (const r of text.R) {
                    if (r?.T) {
                      // Decode URI component for proper text
                      try {
                        fullText += decodeURIComponent(r.T) + ' ';
                      } catch {
                        fullText += r.T + ' ';
                      }
                    }
                  }
                }
              }
              fullText += '\n';
            }
          }
        }
        
        resolve(fullText.trim());
      } catch (error) {
        reject(error);
      }
    });
    
    // Parse the buffer
    pdfParser.parseBuffer(buffer);
  });
}

// Extract text from EPUB
async function extractEpubText(buffer: Buffer): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    let text = '';
    
    const htmlFiles = Object.keys(zip.files).filter(
      name => name.endsWith('.html') || name.endsWith('.xhtml') || name.endsWith('.htm')
    );
    
    // Sort files to read in order
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
  } catch (error) {
    console.error('EPUB extraction error:', error);
    return '';
  }
}

// Generate summaries from text - ALWAYS at least 30 cards
function generateInternalSummary(text: string, bookTitle: string): BookSection[] {
  const sections: BookSection[] = [];
  const icons = ['📖', '💡', '🎯', '⚡', '🧠', '🚀', '💪', '📚', '🌟', '💎', '🔥', '✨', '📌', '🔑', '🛠️', '📈', '🏆', '💫', '🌈', '🎪', '🎨', '🔔', '🌻', '🍀', '🦋', '🌊', '🏔️', '⭐', '🌍', '🔮', '💫', '🎯', '💡', '🔥', '📚', '⚡', '🌟', '💎', '🧠'];
  
  const MIN_CARDS = 30;
  
  // Clean and normalize text
  let cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\s+/g, ' ');
  
  // If text is too short, return placeholder sections
  if (cleanText.length < 500) {
    for (let i = 0; i < MIN_CARDS; i++) {
      sections.push({
        title: `${bookTitle} - Sección ${i + 1}`,
        content: 'Contenido no disponible. Por favor, intenta con otro archivo o formato.',
        icon: icons[i % icons.length]
      });
    }
    return sections;
  }
  
  // Split into sentences
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 30);
  
  // Split into paragraphs
  const paragraphs = cleanText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 50);
  
  // Extract keywords
  const keywords = extractKeywords(cleanText);
  
  // Calculate how many cards we need
  const totalContent = sentences.length + paragraphs.length;
  let cardsNeeded = MIN_CARDS;
  
  // Try to identify chapters/sections
  const chapterPatterns = [
    /^(cap[ií]tulo|chapter|parte|part|secci[oó]n|section)\s*(\d+|[ivxlcIVXLC]+)[:\.\s]*(.*)$/i,
    /^(\d+)[\.\s]+(.{5,50})$/,
    /^(introducci[oó]n|conclusi[oó]n|pr[oó]logo|ep[ií]logo|prefacio)/i
  ];
  
  const chapters: { title: string; content: string }[] = [];
  
  paragraphs.forEach((para) => {
    for (const pattern of chapterPatterns) {
      const match = para.match(pattern);
      if (match) {
        chapters.push({
          title: match[0].substring(0, 60).trim(),
          content: para.substring(0, 500)
        });
        break;
      }
    }
  });
  
  // Add chapter-based cards
  chapters.forEach((chapter, index) => {
    sections.push({
      title: chapter.title,
      content: chapter.content.length > 300 ? chapter.content.substring(0, 300) + '...' : chapter.content,
      icon: icons[index % icons.length]
    });
  });
  
  // Generate sentence-based cards
  if (sentences.length > 0) {
    const step = Math.max(1, Math.floor(sentences.length / Math.max(1, (cardsNeeded - sections.length))));
    
    for (let i = 0; i < sentences.length && sections.length < cardsNeeded; i += step) {
      const sentence = sentences[i];
      const title = extractTitle(sentence, keywords, sections.length);
      
      // Combine with next sentences if too short
      let content = sentence;
      let j = i + 1;
      while (content.length < 150 && j < sentences.length && j < i + 5) {
        content += ' ' + sentences[j];
        j++;
      }
      
      sections.push({
        title,
        content: content.length > 350 ? content.substring(0, 350) + '...' : content,
        icon: icons[sections.length % icons.length]
      });
    }
  }
  
  // Generate paragraph-based cards
  if (paragraphs.length > 0 && sections.length < cardsNeeded) {
    const remaining = cardsNeeded - sections.length;
    const step = Math.max(1, Math.floor(paragraphs.length / remaining));
    
    for (let i = 0; i < paragraphs.length && sections.length < cardsNeeded; i += step) {
      const para = paragraphs[i];
      const title = extractTitle(para, keywords, sections.length);
      
      sections.push({
        title,
        content: para.length > 350 ? para.substring(0, 350) + '...' : para,
        icon: icons[sections.length % icons.length]
      });
    }
  }
  
  // Fill remaining with keyword-based concept cards
  while (sections.length < MIN_CARDS) {
    const keywordIndex = sections.length % keywords.length;
    const keyword = keywords[keywordIndex] || 'concepto';
    
    // Find sentences containing the keyword
    const relevantSentences = sentences.filter(s => 
      s.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 3);
    
    const content = relevantSentences.length > 0 
      ? relevantSentences.join(' ').substring(0, 350)
      : `Concepto importante relacionado con ${keyword}. Este tema es fundamental para entender el contenido del libro.`;
    
    sections.push({
      title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      content: content.length > 350 ? content.substring(0, 350) + '...' : content,
      icon: icons[sections.length % icons.length]
    });
  }
  
  return sections.slice(0, 40); // Max 40 cards
}

// Extract important keywords from text
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en', 'con', 'por', 'para', 'es', 'son', 'fue', 'ser', 'tiene', 'han', 'que', 'se', 'no', 'si', 'y', 'o', 'pero', 'como', 'mas', 'muy', 'su', 'sus', 'este', 'esta', 'estos', 'estas', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'todo', 'nada', 'algo', 'cuando', 'donde', 'porque', 'aunque', 'durante', 'entre', 'sobre', 'hasta', 'desde', 'hacia', 'segun', 'sin', 'sino', 'aunque', 'porque', 'cuando', 'mientras', 'aunque'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\wáéíóúñü\s]/gi, '')
    .split(/\s+/)
    .filter(word => word.length > 4 && !stopWords.has(word));
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

// Extract title from text
function extractTitle(text: string, keywords: string[], index: number): string {
  // First sentence as title
  const firstSentence = text.split(/[.!?]/)[0];
  
  if (firstSentence.length <= 50 && firstSentence.length > 5) {
    return firstSentence.trim();
  }
  
  // Find keywords in text
  const foundKeywords = keywords.filter(kw => 
    text.toLowerCase().includes(kw.toLowerCase())
  ).slice(0, 3);
  
  if (foundKeywords.length > 0) {
    return foundKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ');
  }
  
  return `Concepto Clave ${index + 1}`;
}

// Determine category from content
function determineCategory(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    'riqueza': ['dinero', 'rico', 'riqueza', 'finanzas', 'inversion', 'millonario', 'ingresos', 'activos', 'pasivos', 'bolsa', 'acciones', 'capital'],
    'desarrollo-personal': ['habitos', 'productividad', 'mente', 'consciencia', 'paz', 'felicidad', 'crecimiento', 'proposito', 'vida', 'motivacion', 'exito', 'mentalidad'],
    'psicologia-negocios': ['persuasion', 'influencia', 'negociacion', 'liderazgo', 'comportamiento', 'psicologia', 'decisiones', 'emociones'],
    'emprendimiento': ['startup', 'empresa', 'negocio', 'emprendedor', 'emprender', 'innovacion', 'mercado', 'cliente'],
    'historias-exito': ['biografia', 'historia', 'vida', 'jornada', 'camino', 'trayectoria', 'exito', 'logro'],
    'coaching': ['coach', 'coaching', 'mentor', 'guiar', 'potencial', 'transformacion'],
    'gerencia': ['gerente', 'gestion', 'administrar', 'equipo', 'directivo', 'ejecutivo', 'management'],
    'manejo-proyectos': ['proyecto', 'scrum', 'agile', 'metodologia', 'planificacion', 'sprint', 'kanban']
  };

  let bestCategory = 'desarrollo-personal';
  let maxMatches = 0;
  
  for (const [category, kwList] of Object.entries(categoryKeywords)) {
    const matches = kwList.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  return bestCategory;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bookTitle = (formData.get('title') as string) || file?.name?.replace(/\.[^/.]+$/, '') || 'Libro';
    const author = (formData.get('author') as string) || 'Desconocido';

    if (!file) {
      return NextResponse.json({ error: 'No se encontro ningun archivo' }, { status: 400 });
    }

    let fileContent = '';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const isEPUB = file.name.toLowerCase().endsWith('.epub') || file.type === 'application/epub+zip';
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isTXT = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');
    
    console.log(`Processing: ${file.name}, size: ${(file.size / 1024).toFixed(1)} KB, type: ${isPDF ? 'PDF' : isEPUB ? 'EPUB' : isTXT ? 'TXT' : 'Unknown'}`);

    if (isEPUB) {
      console.log('Extracting EPUB...');
      fileContent = await extractEpubText(buffer);
    } else if (isPDF) {
      console.log('Extracting PDF...');
      try {
        fileContent = await extractPdfText(buffer);
      } catch (pdfError) {
        console.error('PDF extraction failed:', pdfError);
        return NextResponse.json({ 
          error: 'No se pudo extraer el texto del PDF. Por favor, intenta con un archivo TXT o EPUB para mejor compatibilidad.' 
        }, { status: 400 });
      }
    } else if (isTXT) {
      console.log('Extracting TXT...');
      fileContent = await file.text();
    } else {
      return NextResponse.json({ error: 'Formato no soportado. Use PDF, EPUB o TXT' }, { status: 400 });
    }

    console.log(`Extracted text length: ${fileContent.length} characters`);

    if (!fileContent.trim() || fileContent.length < 100) {
      return NextResponse.json({ 
        error: 'No se pudo extraer suficiente texto del archivo. Intenta con otro archivo o formato (TXT/EPUB recomendados).' 
      }, { status: 400 });
    }

    // Generate internal summary (minimum 30 cards)
    console.log('Generating summary with minimum 30 cards...');
    const sections = generateInternalSummary(fileContent, bookTitle);
    console.log(`Generated ${sections.length} sections`);

    const category = determineCategory(bookTitle, fileContent.substring(0, 5000));
    const timestamp = Date.now();
    const uniqueId = bookTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    
    // Split content for reading - paragraph-aware chunking
    const contentChunks: string[] = [];
    const chunkSize = 2000;
    
    // Split by paragraphs first
    const paragraphs = fileContent.split(/\n\n+/);
    let currentChunk = '';
    
    for (const para of paragraphs) {
      if (currentChunk.length + para.length > chunkSize && currentChunk.length > 0) {
        contentChunks.push(currentChunk.trim());
        currentChunk = para;
      } else {
        currentChunk += '\n\n' + para;
      }
    }
    
    if (currentChunk.trim().length > 0) {
      contentChunks.push(currentChunk.trim());
    }
    
    console.log(`Created ${contentChunks.length} reading pages`);
    
    const processedData = {
      id: `book-${uniqueId}-${timestamp}`,
      title: bookTitle,
      author,
      description: `Libro cargado: ${bookTitle}. ${sections.length} secciones generadas.`,
      category,
      cards: sections.map((section, index): GeneratedCard => ({
        id: `${uniqueId}-card-${index}-${timestamp}`,
        title: section.title,
        content: section.content,
        icon: section.icon
      })),
      fullContent: contentChunks,
      totalCharacters: fileContent.length,
      tasks: [],
      isUploaded: true,
      uploadedAt: new Date().toISOString(),
      source: 'internal'
    };

    return NextResponse.json({
      success: true,
      book: processedData,
      totalCards: processedData.cards.length,
      contentLength: fileContent.length,
      totalPages: contentChunks.length,
      source: 'internal'
    });

  } catch (error) {
    console.error('Error processing book:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar el libro' },
      { status: 500 }
    );
  }
}
