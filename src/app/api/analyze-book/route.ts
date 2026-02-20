import { NextRequest, NextResponse } from 'next/server';

interface GeneratedCard {
  id: string;
  title: string;
  content: string;
  icon: string;
}

interface GeneratedTask {
  id: string;
  text: string;
  completed: boolean;
}

// Gemini API integration (free tier)
async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
        topP: 0.95,
        topK: 40
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Gemini API error:', error);
    throw new Error(`Error en Gemini API: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function determineCategory(bookTitle: string, bookDescription: string): string {
  const text = `${bookTitle} ${bookDescription}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    'riqueza': ['dinero', 'rico', 'riqueza', 'finanzas', 'inversion', 'millonario', 'ingresos', 'activos', 'pasivos', 'bolsa', 'acciones', 'capital', 'economia', 'ahorro', 'patrimonio'],
    'desarrollo-personal': ['habitos', 'productividad', 'mente', 'consciencia', 'paz', 'felicidad', 'crecimiento', 'proposito', 'vida', 'motivacion', 'exito', 'mentalidad', 'disciplina', 'personalidad'],
    'psicologia-negocios': ['persuasion', 'influencia', 'negociacion', 'liderazgo', 'comportamiento', 'psicologia', 'decisiones', 'emociones', 'pensamiento', 'cognitivo', 'negocios'],
    'emprendimiento': ['startup', 'empresa', 'negocio', 'emprendedor', 'emprender', 'innovacion', 'mercado', 'cliente', 'modelo de negocio', 'ventaja competitiva', 'fundador'],
    'historias-exito': ['biografia', 'historia', 'vida', 'jornada', 'camino', 'trayectoria', 'exito', 'logro', 'superacion', 'empresario', 'visionario'],
    'coaching': ['coach', 'coaching', 'mentor', 'guiar', 'potencial', 'transformacion', 'desarrollo', 'cambio', 'liderazgo personal'],
    'gerencia': ['gerente', 'gestion', 'administrar', 'equipo', 'directivo', 'ejecutivo', 'management', 'organizacion', 'procesos', 'estrategia', 'empresa'],
    'manejo-proyectos': ['proyecto', 'scrum', 'agile', 'metodologia', 'planificacion', 'sprint', 'gestion de proyectos', 'kanban', 'okr', 'gtd', 'metodo', 'productividad']
  };

  let bestCategory = 'desarrollo-personal';
  let maxMatches = 0;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  return bestCategory;
}

export async function POST(request: NextRequest) {
  try {
    const { bookTitle, author, fileContent } = await request.json();

    if (!bookTitle) {
      return NextResponse.json(
        { error: 'El titulo del libro es requerido' },
        { status: 400 }
      );
    }

    const prompt = `Eres un experto en analisis de libros de desarrollo personal, negocios y crecimiento profesional. Tu tarea es extraer TODO el contenido valioso del libro y presentarlo en tarjetas educativas.

LIBRO: "${bookTitle}"${author ? ` de ${author}` : ''}
${fileContent ? `\nCONTENIDO DEL LIBRO:\n${fileContent.slice(0, 15000)}` : ''}

INSTRUCCIONES CRITICAS:
1. Extrae TODOS los conceptos importantes del libro
2. Cada tarjeta debe tener un concepto UNICO y DIFERENTE
3. NO repitas ideas entre tarjetas
4. Los titulos deben ser cortos, memorables y accionables (max 5 palabras)
5. El contenido de cada tarjeta debe ser practico, directo y poderoso (max 25 palabras)
6. Genera ENTRE 20 Y 30 TARJETAS para cubrir COMPLETAMENTE el libro
7. Cada tarjeta debe poder entenderse de forma independiente
8. Incluye ejemplos concretos cuando sea posible

Devuelve UNICAMENTE un JSON valido con esta estructura exacta (sin markdown, sin explicaciones):
{
  "title": "Titulo del Libro",
  "author": "Autor del Libro",
  "description": "Descripcion breve del libro en 1-2 oraciones que capture su esencia",
  "cards": [
    {
      "title": "Concepto Clave",
      "content": "Explicacion concisa y accionable del concepto",
      "icon": "emoji-representativo"
    }
  ],
  "tasks": [
    {
      "text": "Tarea practica y especifica que el lector puede implementar"
    }
  ]
}

Genera ENTRE 20 Y 30 TARJETAS con TODOS los conceptos importantes del libro.
Genera 10 tareas practicas accionables.`;

    const geminiResponse = await callGeminiAPI(prompt);
    
    // Parse JSON response
    let bookData;
    try {
      let cleanContent = geminiResponse.trim();
      // Remove markdown code blocks if present
      if (cleanContent.includes('```json')) {
        cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (cleanContent.includes('```')) {
        cleanContent = cleanContent.replace(/```\s*/g, '');
      }
      // Find JSON object
      const jsonStart = cleanContent.indexOf('{');
      const jsonEnd = cleanContent.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanContent = cleanContent.slice(jsonStart, jsonEnd + 1);
      }
      
      bookData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', geminiResponse.slice(0, 500));
      throw new Error('Error al procesar la respuesta de Gemini');
    }

    // Validate and process data
    if (!bookData.cards || bookData.cards.length === 0) {
      throw new Error('No se generaron tarjetas');
    }

    const category = determineCategory(bookData.title || bookTitle, bookData.description || '');
    
    // Ensure unique IDs
    const timestamp = Date.now();
    const uniqueId = bookTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    
    const processedData = {
      id: `gemini-${uniqueId}-${timestamp}`,
      title: bookData.title || bookTitle,
      author: bookData.author || author || 'Desconocido',
      description: bookData.description || `Analisis completo de ${bookTitle}`,
      category,
      cards: bookData.cards.slice(0, 30).map((card: GeneratedCard, index: number) => ({
        id: `${uniqueId}-card-${index}-${timestamp}`,
        title: card.title || `Concepto ${index + 1}`,
        content: card.content || 'Contenido no disponible',
        icon: card.icon || ['💡', '🎯', '⚡', '🧠', '🚀', '💪', '📚', '🌟', '💎', '🔥'][index % 10]
      })),
      tasks: (bookData.tasks || []).slice(0, 10).map((task: GeneratedTask, index: number) => ({
        id: `${uniqueId}-task-${index}-${timestamp}`,
        text: task.text || `Tarea ${index + 1}`,
        completed: false
      }))
    };

    return NextResponse.json({
      success: true,
      book: processedData,
      totalCards: processedData.cards.length,
      source: 'gemini'
    });

  } catch (error) {
    console.error('Error in analyze-book:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al analizar el libro' },
      { status: 500 }
    );
  }
}
