import { NextRequest, NextResponse } from 'next/server';

interface BookSection {
  title: string;
  content: string;
  icon: string;
  type: 'concept' | 'summary' | 'question' | 'quote' | 'definition' | 'keypoint' | 'vocabulary' | 'action';
}

interface GeneratedCard {
  id: string;
  title: string;
  content: string;
  icon: string;
}

// ============================================
// MOTOR DE RESUMEN INTERNO - TIPO NOTEBOOKLM
// ============================================

const STOP_WORDS = new Set([
  // Español
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en', 'con', 'por', 'para', 
  'es', 'son', 'fue', 'ser', 'tiene', 'han', 'que', 'se', 'no', 'si', 'y', 'o', 'pero', 'como', 'mas', 'muy', 
  'su', 'sus', 'este', 'esta', 'estos', 'estas', 'todo', 'nada', 'algo', 'cuando', 'donde', 'porque', 'aunque',
  'durante', 'entre', 'sobre', 'hasta', 'desde', 'hacia', 'segun', 'sin', 'sino', 'mientras', 'cada', 'cual',
  'tambien', 'ademas', 'otro', 'otros', 'otra', 'otras', 'puede', 'pueden', 'hacer', 'hace', 'hacen',
  'forma', 'parte', 'tipo', 'manera', 'caso', 'casos', 'vez', 'veces', 'ano', 'anos', 'dia', 'dias',
  'persona', 'personas', 'cosa', 'cosas', 'hecho', 'hechos', 'lugar', 'lugares', 'tiempo', 'momento',
  // English
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as',
  'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'it', 'its', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who', 'where', 'when', 'why', 'how', 'all',
  'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'any', 'about', 'into'
]);

// Extraer palabras clave con TF-IDF simplificado
function extractKeywords(text: string, maxKeywords: number = 60): { word: string; score: number }[] {
  const words = text.toLowerCase()
    .replace(/[^\wáéíóúñü\s]/gi, '')
    .split(/\s+/)
    .filter(word => word.length > 4 && !STOP_WORDS.has(word));
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Score basado en frecuencia y longitud
  return Object.entries(frequency)
    .map(([word, count]) => ({
      word,
      score: count * (word.length > 7 ? 1.5 : 1) * (count > 3 ? 1.3 : 1)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxKeywords);
}

// Detectar capítulos y secciones
function detectChapters(text: string): { title: string; content: string; startIndex: number }[] {
  const chapters: { title: string; content: string; startIndex: number }[] = [];
  
  const chapterPatterns = [
    /^(cap[ií]tulo|chapter)\s*(\d+|[ivxlcIVXLC]+)[:\.\s-]*(.{0,50})$/im,
    /^(parte|part)\s*(\d+|[ivxlcIVXLC]+)[:\.\s-]*(.{0,50})$/im,
    /^(secci[oó]n|section)\s*(\d+)[:\.\s-]*(.{0,50})$/im,
    /^(\d{1,2})[\.\)]\s+(.{5,50})$/im,
    /^(introducci[oó]n|introduction|pr[oó]logo|preface|conclusi[oó]n|conclusion|ep[ií]logo)$/im,
  ];
  
  const lines = text.split('\n');
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length < 100 && trimmedLine.length > 3) {
      for (const pattern of chapterPatterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          chapters.push({
            title: trimmedLine.substring(0, 60).trim(),
            content: text.substring(index, Math.min(index + 2000, text.length)),
            startIndex: index
          });
          break;
        }
      }
    }
  });
  
  // Si no se encontraron capítulos, crear secciones artificiales
  if (chapters.length === 0) {
    const sectionSize = Math.floor(text.length / 10);
    for (let i = 0; i < 10; i++) {
      const start = i * sectionSize;
      const content = text.substring(start, Math.min(start + sectionSize, text.length));
      if (content.trim().length > 100) {
        chapters.push({
          title: `Sección ${i + 1}`,
          content: content,
          startIndex: start
        });
      }
    }
  }
  
  return chapters;
}

// Extraer oraciones significativas
function extractSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 500);
}

// Extraer párrafos significativos
function extractParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim().replace(/\s+/g, ' '))
    .filter(p => p.length > 100);
}

// Extraer definiciones y conceptos
function extractDefinitions(text: string): { term: string; definition: string }[] {
  const definitions: { term: string; definition: string }[] = [];
  
  const patterns = [
    /([A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(?:\s+[a-záéíóúñü]+)?)\s*(?:es|son|significa|se define como|se refiere a|consiste en)\s+([^.]+\.)?/gi,
    /(?:se define|se conoce|se denomina|se llama)\s+([^.]+)\s+como\s+([^.]+\.)?/gi,
    /(?:definici[oó]n|concepto):\s*([^.]+\.)?/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null && definitions.length < 20) {
      const term = match[1]?.trim() || '';
      const definition = match[2]?.trim() || match[1]?.trim() || '';
      
      if (term.length > 3 && definition.length > 20) {
        definitions.push({ term, definition });
      }
    }
  });
  
  return definitions;
}

// Extraer citas importantes
function extractQuotes(text: string): string[] {
  const quotes: string[] = [];
  
  // Citas entre comillas
  const quotedMatches = text.match(/[""«]([^""»]{30,200})[""»]/g);
  if (quotedMatches) {
    quotes.push(...quotedMatches.map(q => q.replace(/[""«»]/g, '').trim()));
  }
  
  // Oraciones que parecen citas o afirmaciones importantes
  const sentences = extractSentences(text);
  sentences.forEach(sentence => {
    if (quotes.length < 15 && (
      sentence.includes(' es ') ||
      sentence.includes(' significa ') ||
      sentence.includes(' importante ') ||
      sentence.includes(' clave ') ||
      sentence.includes(' fundamental ') ||
      sentence.includes(' esencial ')
    )) {
      if (!quotes.includes(sentence)) {
        quotes.push(sentence);
      }
    }
  });
  
  return quotes.slice(0, 15);
}

// Generar preguntas de estudio
function generateStudyQuestions(text: string, keywords: { word: string; score: number }[]): { question: string; answer: string }[] {
  const questions: { question: string; answer: string }[] = [];
  const sentences = extractSentences(text);
  
  keywords.slice(0, 20).forEach(kw => {
    const relevantSentences = sentences.filter(s => 
      s.toLowerCase().includes(kw.word.toLowerCase())
    );
    
    if (relevantSentences.length > 0) {
      const answer = relevantSentences.slice(0, 2).join(' ').substring(0, 300);
      
      questions.push({
        question: `¿Qué es o qué significa "${kw.word}" en el contexto del libro?`,
        answer: answer.length > 50 ? answer : `Concepto clave relacionado con ${kw.word}.`
      });
    }
  });
  
  // Preguntas generales
  const generalQuestions = [
    { q: '¿Cuál es la idea principal del libro?', pattern: /(?:idea principal|tema central|prop[oó]sito|objetivo)/i },
    { q: '¿Qué enseña el autor sobre el éxito?', pattern: /(?:[eé]xito|logro|meta|objetivo)/i },
    { q: '¿Cómo se aplica este conocimiento?', pattern: /(?:aplicar|implementar|pr[aá]ctica|ejercicio)/i },
    { q: '¿Cuáles son los principios fundamentales?', pattern: /(?:principio|fundamento|base|esencial)/i },
  ];
  
  generalQuestions.forEach(({ q, pattern }) => {
    const relevantSentences = sentences.filter(s => pattern.test(s));
    if (relevantSentences.length > 0 && questions.length < 30) {
      questions.push({
        question: q,
        answer: relevantSentences.slice(0, 2).join(' ').substring(0, 300)
      });
    }
  });
  
  return questions.slice(0, 25);
}

// Extraer puntos de acción / tareas
function extractActionPoints(text: string): string[] {
  const actions: string[] = [];
  
  const patterns = [
    /(?:debes|tiene que|hay que|necesitas|puedes|importante)\s+([^.!?]+[.!?])/gi,
    /(?:paso|ejercicio|pr[aá]ctica|actividad|acci[oó]n)\s*\d*[:\.\s]*([^.!?]+[.!?])/gi,
    /(?:para|c[oó]mo)\s+(?:lograr|conseguir|alcanzar|implementar)\s+([^.!?]+[.!?])/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null && actions.length < 15) {
      const action = match[1] || match[0];
      if (action.trim().length > 20) {
        actions.push(action.trim());
      }
    }
  });
  
  return actions.slice(0, 15);
}

// Generar resumen por sección
function generateSectionSummary(text: string, maxLength: number = 350): string {
  const sentences = extractSentences(text);
  
  if (sentences.length === 0) return text.substring(0, maxLength);
  
  // Tomar las oraciones más representativas (primera, del medio, y últimas)
  const selectedSentences: string[] = [];
  
  if (sentences.length > 0) selectedSentences.push(sentences[0]);
  if (sentences.length > 2) selectedSentences.push(sentences[Math.floor(sentences.length / 2)]);
  if (sentences.length > 4) selectedSentences.push(sentences[sentences.length - 1]);
  
  const summary = selectedSentences.join(' ');
  return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
}

// ============================================
// FUNCIÓN PRINCIPAL DE GENERACIÓN DE TARJETAS
// ============================================

function generateNotebookLMStyleCards(text: string, bookTitle: string): BookSection[] {
  const cards: BookSection[] = [];
  const MIN_CARDS = 30;
  
  console.log(`Starting card generation for: ${bookTitle}, text length: ${text.length}`);
  
  // 1. Extraer componentes del texto
  const keywords = extractKeywords(text);
  const chapters = detectChapters(text);
  const sentences = extractSentences(text);
  const paragraphs = extractParagraphs(text);
  const definitions = extractDefinitions(text);
  const quotes = extractQuotes(text);
  const questions = generateStudyQuestions(text, keywords);
  const actions = extractActionPoints(text);
  
  console.log(`Extracted: ${keywords.length} keywords, ${chapters.length} chapters, ${sentences.length} sentences`);
  console.log(`Definitions: ${definitions.length}, Quotes: ${quotes.length}, Questions: ${questions.length}, Actions: ${actions.length}`);
  
  const icons = {
    concept: '💡',
    summary: '📖',
    question: '❓',
    quote: '💬',
    definition: '📚',
    keypoint: '🔑',
    vocabulary: '📝',
    action: '✅'
  };
  
  // 2. Crear tarjeta de resumen general
  cards.push({
    title: `📖 Resumen: ${bookTitle}`,
    content: generateSectionSummary(text, 400),
    icon: '📖',
    type: 'summary'
  });
  
  // 3. Tarjetas de conceptos principales
  keywords.slice(0, 10).forEach((kw, index) => {
    const relevantSentences = sentences.filter(s => 
      s.toLowerCase().includes(kw.word.toLowerCase())
    ).slice(0, 2);
    
    if (relevantSentences.length > 0) {
      cards.push({
        title: `💡 ${kw.word.charAt(0).toUpperCase() + kw.word.slice(1)}`,
        content: relevantSentences.join(' ').substring(0, 300),
        icon: '💡',
        type: 'concept'
      });
    }
  });
  
  // 4. Tarjetas de capítulos/secciones
  chapters.slice(0, 8).forEach((chapter, index) => {
    cards.push({
      title: `📑 ${chapter.title}`,
      content: generateSectionSummary(chapter.content, 300),
      icon: '📑',
      type: 'summary'
    });
  });
  
  // 5. Tarjetas de definiciones
  definitions.forEach((def, index) => {
    cards.push({
      title: `📚 ${def.term}`,
      content: def.definition.substring(0, 300),
      icon: '📚',
      type: 'definition'
    });
  });
  
  // 6. Tarjetas de citas importantes
  quotes.slice(0, 8).forEach((quote, index) => {
    cards.push({
      title: `💬 Cita ${index + 1}`,
      content: quote.substring(0, 300),
      icon: '💬',
      type: 'quote'
    });
  });
  
  // 7. Tarjetas de preguntas de estudio
  questions.slice(0, 10).forEach((q, index) => {
    cards.push({
      title: `❓ ${q.question.substring(0, 50)}...`,
      content: `Pregunta: ${q.question}\n\nRespuesta: ${q.answer}`,
      icon: '❓',
      type: 'question'
    });
  });
  
  // 8. Tarjetas de puntos de acción
  actions.slice(0, 8).forEach((action, index) => {
    cards.push({
      title: `✅ Acción ${index + 1}`,
      content: action.substring(0, 300),
      icon: '✅',
      type: 'action'
    });
  });
  
  // 9. Tarjetas de párrafos clave (distribuidos)
  if (paragraphs.length > 0 && cards.length < MIN_CARDS) {
    const step = Math.max(1, Math.floor(paragraphs.length / (MIN_CARDS - cards.length)));
    for (let i = 0; i < paragraphs.length && cards.length < MIN_CARDS; i += step) {
      const para = paragraphs[i];
      const relevantKeywords = keywords.filter(kw => 
        para.toLowerCase().includes(kw.word.toLowerCase())
      ).slice(0, 2);
      
      const title = relevantKeywords.length > 0 
        ? `🔑 ${relevantKeywords.map(k => k.word.charAt(0).toUpperCase() + k.word.slice(1)).join(' & ')}`
        : `🔑 Punto Clave ${cards.length + 1}`;
      
      cards.push({
        title,
        content: para.length > 350 ? para.substring(0, 350) + '...' : para,
        icon: '🔑',
        type: 'keypoint'
      });
    }
  }
  
  // 10. Tarjetas de vocabulario/keywords restantes
  if (cards.length < MIN_CARDS) {
    keywords.slice(cards.length, MIN_CARDS).forEach((kw) => {
      const relevantSentences = sentences.filter(s => 
        s.toLowerCase().includes(kw.word.toLowerCase())
      ).slice(0, 2);
      
      cards.push({
        title: `📝 ${kw.word.charAt(0).toUpperCase() + kw.word.slice(1)}`,
        content: relevantSentences.length > 0 
          ? relevantSentences.join(' ').substring(0, 300)
          : `Concepto importante del libro: ${kw.word}. Este término aparece frecuentemente y es clave para entender el contenido.`,
        icon: '📝',
        type: 'vocabulary'
      });
    });
  }
  
  // 11. Asegurar mínimo de tarjetas
  while (cards.length < MIN_CARDS) {
    const sentenceIndex = cards.length % sentences.length;
    const sentence = sentences[sentenceIndex] || 'Contenido del libro para estudio.';
    
    cards.push({
      title: `📖 Punto de Estudio ${cards.length + 1}`,
      content: sentence.substring(0, 300),
      icon: '📖',
      type: 'keypoint'
    });
  }
  
  console.log(`Generated ${cards.length} cards total`);
  
  return cards.slice(0, 50); // Máximo 50 tarjetas
}

// Determinar categoría del libro
function determineCategory(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    'riqueza': ['dinero', 'rico', 'riqueza', 'finanzas', 'inversion', 'millonario', 'ingresos', 'activos', 'pasivos', 'bolsa', 'acciones', 'capital', 'ahorro', 'rentabilidad'],
    'desarrollo-personal': ['habitos', 'productividad', 'mente', 'consciencia', 'paz', 'felicidad', 'crecimiento', 'proposito', 'vida', 'motivacion', 'exito', 'mentalidad', 'mindfulness'],
    'psicologia-negocios': ['persuasion', 'influencia', 'negociacion', 'liderazgo', 'comportamiento', 'psicologia', 'decisiones', 'emociones', 'mente', 'cerebro'],
    'emprendimiento': ['startup', 'empresa', 'negocio', 'emprendedor', 'emprender', 'innovacion', 'mercado', 'cliente', 'producto', 'servicio'],
    'historias-exito': ['biografia', 'historia', 'vida', 'jornada', 'camino', 'trayectoria', 'exito', 'logro', 'historia'],
    'coaching': ['coach', 'coaching', 'mentor', 'guiar', 'potencial', 'transformacion', 'cambio', 'desarrollo'],
    'gerencia': ['gerente', 'gestion', 'administrar', 'equipo', 'directivo', 'ejecutivo', 'management', 'organizacion'],
    'manejo-proyectos': ['proyecto', 'scrum', 'agile', 'metodologia', 'planificacion', 'sprint', 'kanban', 'equipo']
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

// ============================================
// ENDPOINT PRINCIPAL
// ============================================

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // El texto puede venir pre-extraído del cliente (PDF.js) o como archivo
    let fileContent = formData.get('extractedText') as string;
    const bookTitle = (formData.get('title') as string) || 'Libro';
    const author = (formData.get('author') as string) || 'Desconocido';
    
    // Si no hay texto extraído, procesar archivo directamente
    if (!fileContent) {
      const file = formData.get('file') as File;
      if (file) {
        fileContent = await file.text();
      }
    }

    if (!fileContent || fileContent.trim().length < 100) {
      return NextResponse.json({ 
        error: 'No se pudo extraer suficiente texto del archivo. El PDF puede contener imágenes escaneadas. Intenta con TXT o EPUB.' 
      }, { status: 400 });
    }

    console.log(`Processing: ${bookTitle}, text length: ${fileContent.length} characters`);

    // Generar tarjetas tipo NotebookLM
    console.log('Generating NotebookLM-style cards...');
    const sections = generateNotebookLMStyleCards(fileContent, bookTitle);
    console.log(`Generated ${sections.length} cards`);

    const category = determineCategory(bookTitle, fileContent.substring(0, 5000));
    const timestamp = Date.now();
    const uniqueId = bookTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    
    // Dividir contenido en páginas para lectura
    const contentChunks: string[] = [];
    const chunkSize = 2000;
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
      description: `Libro procesado: ${bookTitle}. ${sections.length} tarjetas de estudio generadas automáticamente.`,
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
      source: 'internal-engine'
    };

    return NextResponse.json({
      success: true,
      book: processedData,
      totalCards: processedData.cards.length,
      contentLength: fileContent.length,
      totalPages: contentChunks.length,
      source: 'internal-engine',
      message: `Procesado exitosamente. ${sections.length} tarjetas generadas.`
    });

  } catch (error) {
    console.error('Error processing book:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar el libro' },
      { status: 500 }
    );
  }
}

