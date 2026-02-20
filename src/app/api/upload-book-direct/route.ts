import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import JSZip from 'jszip';

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

// Extract text from PDF
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer, { max: 0 });
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return '';
  }
}

// Extract text from EPUB
async function extractEpubText(buffer: Buffer): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    let text = '';
    
    const htmlFiles = Object.keys(zip.files).filter(
      name => name.endsWith('.html') || name.endsWith('.xhtml') || name.endsWith('.htm')
    );
    
    for (const fileName of htmlFiles.slice(0, 100)) {
      const content = await zip.file(fileName)?.async('text');
      if (content) {
        const plainText = content
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .trim();
        
        if (plainText.length > 50) {
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

// Internal function to generate summaries without AI
function generateInternalSummary(text: string, bookTitle: string): BookSection[] {
  const sections: BookSection[] = [];
  const icons = ['📖', '💡', '🎯', '⚡', '🧠', '🚀', '💪', '📚', '🌟', '💎', '🔥', '✨', '📌', '🔑', '🛠️', '📈', '🏆', '💫', '🌈', '🎪', '🎨', '🔔', '🌻', '🍀', '🦋', '🌊', '🏔️', '⭐', '🌍', '🔮'];
  
  // Clean and normalize text
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split into paragraphs
  const paragraphs = cleanText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 50);
  
  if (paragraphs.length === 0) {
    // If no paragraphs found, split by sentences
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 30);
    sentences.forEach((sentence, index) => {
      sections.push({
        title: `Sección ${index + 1}`,
        content: sentence.trim().substring(0, 200) + (sentence.length > 200 ? '...' : ''),
        icon: icons[index % icons.length]
      });
    });
    return sections;
  }
  
  // Extract keywords from text
  const keywords = extractKeywords(cleanText);
  
  // Try to identify chapters
  const chapterPatterns = [
    /^(capítulo|chapter|parte|part|sección|section)\s*(\d+|[ivxlcIVXLC]+)[:\.\s]*(.*)$/i,
    /^(\d+)[\.\s]+(.{10,50})$/,
    /^(introducción|conclusión|prólogo|epílogo|prefacio)/i
  ];
  
  const chapters: { title: string; paragraphs: string[] }[] = [];
  let currentChapter = { title: 'Inicio', paragraphs: [] as string[] };
  
  paragraphs.forEach((para) => {
    let isChapterStart = false;
    
    for (const pattern of chapterPatterns) {
      const match = para.match(pattern);
      if (match) {
        if (currentChapter.paragraphs.length > 0) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          title: match[0].substring(0, 50).trim(),
          paragraphs: []
        };
        isChapterStart = true;
        break;
      }
    }
    
    if (!isChapterStart) {
      currentChapter.paragraphs.push(para);
    }
  });
  
  if (currentChapter.paragraphs.length > 0) {
    chapters.push(currentChapter);
  }
  
  // If chapters found, create cards from chapters
  if (chapters.length > 1) {
    chapters.forEach((chapter, index) => {
      if (chapter.paragraphs.length > 0) {
        const keyParagraphs = chapter.paragraphs.filter(p => p.length > 100).slice(0, 3);
        const content = keyParagraphs.join(' ').substring(0, 300);
        
        sections.push({
          title: chapter.title.substring(0, 40),
          content: content + (content.length >= 300 ? '...' : ''),
          icon: icons[index % icons.length]
        });
      }
    });
  }
  
  // If not enough sections, use paragraph-based sections
  if (sections.length < 10) {
    const totalParagraphs = paragraphs.length;
    const cardsToGenerate = Math.min(30, Math.max(15, Math.floor(totalParagraphs / 10)));
    const step = Math.max(1, Math.floor(totalParagraphs / cardsToGenerate));
    
    for (let i = 0; i < cardsToGenerate && i * step < totalParagraphs; i++) {
      const para = paragraphs[i * step];
      const title = extractTitle(para, keywords, i);
      
      sections.push({
        title,
        content: para.substring(0, 250) + (para.length > 250 ? '...' : ''),
        icon: icons[i % icons.length]
      });
    }
  }
  
  // Add concept cards based on keyword density
  const conceptCards = createConceptCards(paragraphs, keywords, icons);
  sections.push(...conceptCards.slice(0, 10));
  
  return sections;
}

// Extract important keywords from text
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en', 'con', 'por', 'para', 'es', 'son', 'fue', 'ser', 'tiene', 'han', 'que', 'se', 'no', 'si', 'y', 'o', 'pero', 'como', 'más', 'muy', 'su', 'sus', 'este', 'esta', 'estos', 'estas', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then'
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
    .slice(0, 30)
    .map(([word]) => word);
}

// Extract title from paragraph
function extractTitle(paragraph: string, keywords: string[], index: number): string {
  const firstSentence = paragraph.split(/[.!?]/)[0];
  
  if (firstSentence.length <= 50 && firstSentence.length > 5) {
    return firstSentence.trim();
  }
  
  const foundKeywords = keywords.filter(kw => 
    paragraph.toLowerCase().includes(kw.toLowerCase())
  ).slice(0, 3);
  
  if (foundKeywords.length > 0) {
    return foundKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ');
  }
  
  return `Concepto ${index + 1}`;
}

// Create concept cards from paragraphs with high keyword density
function createConceptCards(paragraphs: string[], keywords: string[], icons: string[]): BookSection[] {
  const cards: BookSection[] = [];
  
  const scoredParagraphs = paragraphs.map((para) => {
    const lowerPara = para.toLowerCase();
    let score = 0;
    keywords.forEach(kw => {
      const regex = new RegExp(kw, 'gi');
      const matches = lowerPara.match(regex);
      if (matches) score += matches.length;
    });
    return { paragraph: para, score };
  });
  
  const topParagraphs = scoredParagraphs
    .filter(sp => sp.paragraph.length > 80 && sp.paragraph.length < 500)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
  
  topParagraphs.forEach((sp, cardIndex) => {
    const title = extractTitle(sp.paragraph, keywords, cardIndex);
    cards.push({
      title,
      content: sp.paragraph.substring(0, 250) + (sp.paragraph.length > 250 ? '...' : ''),
      icon: icons[(cardIndex + 10) % icons.length]
    });
  });
  
  return cards;
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
    
    const isEPUB = file.name.endsWith('.epub') || file.type === 'application/epub+zip';
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isTXT = file.type === 'text/plain' || file.name.endsWith('.txt');
    
    console.log(`Processing: ${file.name}, size: ${(file.size / 1024).toFixed(1)} KB`);

    if (isEPUB) {
      fileContent = await extractEpubText(buffer);
    } else if (isPDF) {
      fileContent = await extractPdfText(buffer);
    } else if (isTXT) {
      fileContent = await file.text();
    } else {
      return NextResponse.json({ error: 'Formato no soportado. Use PDF, EPUB o TXT' }, { status: 400 });
    }

    if (!fileContent.trim()) {
      return NextResponse.json({ error: 'No se pudo extraer texto del archivo.' }, { status: 400 });
    }

    // Generate internal summary (no AI)
    console.log('Generating internal summary...');
    const sections = generateInternalSummary(fileContent, bookTitle);
    console.log(`Generated ${sections.length} sections`);

    const category = determineCategory(bookTitle, fileContent.substring(0, 5000));
    const timestamp = Date.now();
    const uniqueId = bookTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    
    // Split content for reading - better paragraph-aware chunking
    const contentChunks: string[] = [];
    const chunkSize = 2500; // characters per page
    
    let currentPosition = 0;
    while (currentPosition < fileContent.length) {
      let endPosition = Math.min(currentPosition + chunkSize, fileContent.length);
      
      // Try to find a natural break point (paragraph or sentence)
      if (endPosition < fileContent.length) {
        const searchStart = Math.max(currentPosition + chunkSize - 200, currentPosition);
        const searchText = fileContent.substring(searchStart, endPosition + 100);
        
        // Look for paragraph break first
        const paragraphBreak = searchText.lastIndexOf('\n\n');
        if (paragraphBreak > 0) {
          endPosition = searchStart + paragraphBreak + 2;
        } else {
          // Look for sentence break
          const sentenceBreak = searchText.lastIndexOf('. ');
          if (sentenceBreak > 0) {
            endPosition = searchStart + sentenceBreak + 2;
          }
        }
      }
      
      const chunk = fileContent.substring(currentPosition, endPosition).trim();
      if (chunk.length > 0) {
        contentChunks.push(chunk);
      }
      currentPosition = endPosition;
    }
    
    const processedData = {
      id: `book-${uniqueId}-${timestamp}`,
      title: bookTitle,
      author,
      description: `Libro cargado: ${bookTitle}. ${sections.length} secciones generadas.`,
      category,
      cards: sections.slice(0, 40).map((section, index): GeneratedCard => ({
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
