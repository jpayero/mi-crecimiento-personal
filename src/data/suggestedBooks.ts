// Suggested books for users to explore
export interface SuggestedBook {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  year: number;
  popularTopics: string[];
  coverEmoji: string;
}

export const suggestedBooks: SuggestedBook[] = [
  // RIQUEZA
  {
    id: 'sug-atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'desarrollo-personal',
    description: 'Sistema probado para construir buenos habitos y romper los malos. Pequenos cambios, resultados extraordinarios.',
    year: 2018,
    popularTopics: ['habitos', 'cambio de comportamiento', 'sistemas', 'progreso'],
    coverEmoji: '⚛️'
  },
  {
    id: 'sug-rich-dad-poor-dad',
    title: 'Padre Rico, Padre Pobre',
    author: 'Robert Kiyosaki',
    category: 'riqueza',
    description: 'Lecciones financieras que la escuela no ensena. La diferencia entre activos y pasivos.',
    year: 1997,
    popularTopics: ['educacion financiera', 'activos', 'inversion', 'libertad financiera'],
    coverEmoji: '💰'
  },
  {
    id: 'sug-think-and-grow-rich',
    title: 'Piense y Hagase Rico',
    author: 'Napoleon Hill',
    category: 'riqueza',
    description: 'Los principios del exito basados en el estudio de 500 millonarios.',
    year: 1937,
    popularTopics: ['mentalidad', 'deseo', 'fe', 'persistencia', 'exito'],
    coverEmoji: '🏔️'
  },
  {
    id: 'sug-millionaire-next-door',
    title: 'El Millonario de al Lado',
    author: 'Thomas Stanley',
    category: 'riqueza',
    description: 'Como realmente se hacen ricos los estadounidenses. Mitos vs realidad.',
    year: 1996,
    popularTopics: ['ahorro', 'estilo de vida', 'inversion', 'frugalidad'],
    coverEmoji: '🏡'
  },
  // DESARROLLO PERSONAL
  {
    id: 'sug-7-habits',
    title: 'Los 7 Habitos de la Gente Altamente Efectiva',
    author: 'Stephen Covey',
    category: 'desarrollo-personal',
    description: 'Principios fundamentales para el exito personal y profesional.',
    year: 1989,
    popularTopics: ['proactividad', 'vision', 'prioridades', 'sinergia'],
    coverEmoji: '🎯'
  },
  {
    id: 'sug-power-of-now',
    title: 'El Poder del Ahora',
    author: 'Eckhart Tolle',
    category: 'desarrollo-personal',
    description: 'Guia espiritual para la iluminacion y el fin del sufrimiento.',
    year: 1997,
    popularTopics: ['consciencia', 'presente', 'ego', 'paz interior'],
    coverEmoji: '✨'
  },
  {
    id: 'sug-mindset',
    title: 'Mindset: La Psicologia del Exito',
    author: 'Carol Dweck',
    category: 'psicologia-negocios',
    description: 'Como nuestra mentalidad afecta nuestro exito y crecimiento.',
    year: 2006,
    popularTopics: ['mentalidad fija', 'mentalidad de crecimiento', 'aprendizaje'],
    coverEmoji: '🧠'
  },
  {
    id: 'sug-grit',
    title: 'Grit: El Poder de la Pasion y la Perseverancia',
    author: 'Angela Duckworth',
    category: 'desarrollo-personal',
    description: 'Por que el esfuerzo es mas importante que el talento.',
    year: 2016,
    popularTopics: ['pasion', 'perseverancia', 'resiliencia', 'esfuerzo'],
    coverEmoji: '💪'
  },
  // EMPRENDIMIENTO
  {
    id: 'sug-lean-startup',
    title: 'El Metodo Lean Startup',
    author: 'Eric Ries',
    category: 'emprendimiento',
    description: 'Metodologia para crear empresas exitosas con innovacion continua.',
    year: 2011,
    popularTopics: ['MVP', 'pivot', 'validacion', 'experimentos'],
    coverEmoji: '🚀'
  },
  {
    id: 'sug-zero-to-one',
    title: 'De Cero a Uno',
    author: 'Peter Thiel',
    category: 'emprendimiento',
    description: 'Notas sobre startups y como construir el futuro.',
    year: 2014,
    popularTopics: ['innovacion', 'monopolio', 'tecnologia', 'valor'],
    coverEmoji: '🌟'
  },
  {
    id: 'sug-start-with-why',
    title: 'Empieza por el Por Que',
    author: 'Simon Sinek',
    category: 'emprendimiento',
    description: 'Como los grandes lideres inspiran accion.',
    year: 2009,
    popularTopics: ['proposito', 'liderazgo', 'inspiracion', 'marca'],
    coverEmoji: '🎯'
  },
  {
    id: 'sug-hard-thing',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    category: 'emprendimiento',
    description: 'Construir un negocio cuando no hay respuestas faciles.',
    year: 2014,
    popularTopics: ['gestion de crisis', 'liderazgo', 'decisiones', 'CEO'],
    coverEmoji: '🔥'
  },
  // PSICOLOGIA DE NEGOCIOS
  {
    id: 'sug-influence',
    title: 'Influencia: La Psicologia de la Persuasion',
    author: 'Robert Cialdini',
    category: 'psicologia-negocios',
    description: 'Los 6 principios universales de influencia.',
    year: 1984,
    popularTopics: ['persuasion', 'reciprocidad', 'autoridad', 'escasez'],
    coverEmoji: '🧲'
  },
  {
    id: 'sug-thinking-fast-slow',
    title: 'Pensar Rapido, Pensar Despacio',
    author: 'Daniel Kahneman',
    category: 'psicologia-negocios',
    description: 'Dos sistemas que controlan nuestras decisiones.',
    year: 2011,
    popularTopics: ['sesgos cognitivos', 'decisiones', 'intuicion', 'racionalidad'],
    coverEmoji: '🧠'
  },
  {
    id: 'sug-how-win-friends',
    title: 'Como Ganar Amigos e Influir en Personas',
    author: 'Dale Carnegie',
    category: 'psicologia-negocios',
    description: 'El clasico sobre relaciones interpersonales.',
    year: 1936,
    popularTopics: ['relaciones', 'comunicacion', 'liderazgo', 'influencia'],
    coverEmoji: '🤝'
  },
  // GERENCIA
  {
    id: 'sug-goal',
    title: 'La Meta',
    author: 'Eliyahu Goldratt',
    category: 'gerencia',
    description: 'Teoria de restricciones aplicada a los negocios.',
    year: 1984,
    popularTopics: ['restricciones', 'cuellos de botella', 'produccion', 'eficiencia'],
    coverEmoji: '🎯'
  },
  {
    id: 'sug-effective-executive',
    title: 'El Ejecutivo Efectivo',
    author: 'Peter Drucker',
    category: 'gerencia',
    description: 'Principios para ser efectivo en organizaciones.',
    year: 1966,
    popularTopics: ['tiempo', 'decisiones', 'fortalezas', 'contribucion'],
    coverEmoji: '👔'
  },
  {
    id: 'sug-good-to-great',
    title: 'De Bueno a Excelente',
    author: 'Jim Collins',
    category: 'gerencia',
    description: 'Por que algunas empresas dan el salto y otras no.',
    year: 2001,
    popularTopics: ['liderazgo nivel 5', 'disciplina', 'cultura', 'excelencia'],
    coverEmoji: '📈'
  },
  {
    id: 'sug-first-break-rules',
    title: 'Primero Rompa Todas las Reglas',
    author: 'Marcus Buckingham',
    category: 'gerencia',
    description: 'Lo que los mejores gerentes hacen diferente.',
    year: 1999,
    popularTopics: ['talento', 'fortalezas', 'equipos', 'gestion'],
    coverEmoji: '🔨'
  },
  // MANEJO DE PROYECTOS
  {
    id: 'sug-scrum',
    title: 'Scrum: El Arte de Hacer el Doble',
    author: 'Jeff Sutherland',
    category: 'manejo-proyectos',
    description: 'Metodologia agil para equipos de alto rendimiento.',
    year: 2014,
    popularTopics: ['sprints', 'equipo', 'retrospectivas', 'velocidad'],
    coverEmoji: '🔄'
  },
  {
    id: 'sug-gtd',
    title: 'Getting Things Done',
    author: 'David Allen',
    category: 'manejo-proyectos',
    description: 'El metodo de productividad personal mas influyente.',
    year: 2001,
    popularTopics: ['organizacion', 'productividad', 'proyectos', 'flujos'],
    coverEmoji: '📋'
  },
  {
    id: 'sug-measure-what-matters',
    title: 'Mide lo que Importa',
    author: 'John Doerr',
    category: 'manejo-proyectos',
    description: 'Como Google y otras empresas usan OKRs.',
    year: 2017,
    popularTopics: ['OKRs', 'metricas', 'alineacion', 'objetivos'],
    coverEmoji: '📊'
  },
  {
    id: 'sug-deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'manejo-proyectos',
    description: 'Reglas para el exito en un mundo distraido.',
    year: 2016,
    popularTopics: ['concentracion', 'productividad', 'enfoque', 'habilidades'],
    coverEmoji: '🎯'
  },
  // COACHING
  {
    id: 'sug-coaching-habit',
    title: 'El Habito del Coaching',
    author: 'Michael Bungay Stanier',
    category: 'coaching',
    description: 'Como decir menos para lograr mas como coach.',
    year: 2016,
    popularTopics: ['preguntas', 'escucha', 'coaching', 'desarrollo'],
    coverEmoji: '🗣️'
  },
  {
    id: 'sug-inner-game',
    title: 'The Inner Game of Tennis',
    author: 'Timothy Gallwey',
    category: 'coaching',
    description: 'El clasico sobre rendimiento y la mente.',
    year: 1974,
    popularTopics: ['rendimiento', 'mente', 'concentracion', 'potencial'],
    coverEmoji: '🎾'
  },
  // HISTORIAS DE EXITO
  {
    id: 'sug-steve-jobs',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    category: 'historias-exito',
    description: 'La biografia definitiva del fundador de Apple.',
    year: 2011,
    popularTopics: ['vision', 'diseno', 'innovacion', 'perseverancia'],
    coverEmoji: '🍎'
  },
  {
    id: 'sug-shoe-dog',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    category: 'historias-exito',
    description: 'La historia de Nike por su fundador.',
    year: 2016,
    popularTopics: ['emprendimiento', 'marca', 'persistencia', 'equipo'],
    coverEmoji: '👟'
  },
  {
    id: 'sug-elon-musk',
    title: 'Elon Musk',
    author: 'Ashlee Vance',
    category: 'historias-exito',
    description: 'La vida del visionario detras de Tesla y SpaceX.',
    year: 2015,
    popularTopics: ['innovacion', 'vision', 'riesgo', 'tecnologia'],
    coverEmoji: '🚀'
  },
  {
    id: 'sug-shoe-dog-phil',
    title: 'Born a Crime',
    author: 'Trevor Noah',
    category: 'historias-exito',
    description: 'Historia de supervivencia y triunfo en Sudafrica.',
    year: 2016,
    popularTopics: ['resiliencia', 'identidad', 'familia', 'superacion'],
    coverEmoji: '📖'
  }
];

export function getSuggestedBooksByCategory(category: string): SuggestedBook[] {
  return suggestedBooks.filter(book => book.category === category);
}

export function getPopularSuggestedBooks(limit: number = 10): SuggestedBook[] {
  // Return a mix of popular books across categories
  const popularIds = [
    'sug-atomic-habits',
    'sug-rich-dad-poor-dad',
    'sug-7-habits',
    'sug-lean-startup',
    'sug-influence',
    'sug-thinking-fast-slow',
    'sug-deep-work',
    'sug-mindset',
    'sug-gtd',
    'sug-good-to-great'
  ];
  
  return suggestedBooks.filter(book => popularIds.includes(book.id)).slice(0, limit);
}
