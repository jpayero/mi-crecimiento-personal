export type Category = 
  | 'riqueza' 
  | 'desarrollo-personal' 
  | 'psicologia-negocios' 
  | 'emprendimiento' 
  | 'historias-exito' 
  | 'coaching'
  | 'gerencia'
  | 'manejo-proyectos';

export interface KanbanCard {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  cards: KanbanCard[];
  tasks: Task[];
  fullContent?: string[]; // Full book content for reading
  totalCharacters?: number;
  isUploaded?: boolean;
  uploadedAt?: string;
  source?: string;
}

export const categoryConfig: Record<Category, { name: string; color: string; gradient: string; border: string }> = {
  'riqueza': {
    name: 'Riqueza',
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-yellow-600/20',
    border: 'border-amber-500/50'
  },
  'desarrollo-personal': {
    name: 'Desarrollo Personal',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-600/20',
    border: 'border-emerald-500/50'
  },
  'psicologia-negocios': {
    name: 'Psicologia de Negocios',
    color: 'text-indigo-400',
    gradient: 'from-indigo-500/20 to-blue-600/20',
    border: 'border-indigo-500/50'
  },
  'emprendimiento': {
    name: 'Emprendimiento',
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/50'
  },
  'historias-exito': {
    name: 'Historias de Exito',
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-violet-600/20',
    border: 'border-purple-500/50'
  },
  'coaching': {
    name: 'Coaching',
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-rose-600/20',
    border: 'border-pink-500/50'
  },
  'gerencia': {
    name: 'Gerencia',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-teal-600/20',
    border: 'border-cyan-500/50'
  },
  'manejo-proyectos': {
    name: 'Manejo de Proyectos',
    color: 'text-lime-400',
    gradient: 'from-lime-500/20 to-green-500/20',
    border: 'border-lime-500/50'
  }
};

export const books: Book[] = [
  {
    id: 'piense-hagase-rico',
    title: 'Piense y Hagase Rico',
    author: 'Napoleon Hill',
    category: 'riqueza',
    cards: [
      {
        id: 'phr-1',
        title: 'El Deseo Ardiente',
        content: 'El exito comienza con un deseo intenso y ardiente. No basta con querer; debes obsesionarte con tu objetivo hasta convertirlo en una necesidad imperiosa.',
        icon: '🔥'
      },
      {
        id: 'phr-2',
        title: 'La Fe Inquebrantable',
        content: 'Cree firmemente en tu capacidad de exito. La fe es el puente entre lo que quieres y lo que obtienes. Visualiza tu exito como si ya fuera real.',
        icon: '⚡'
      },
      {
        id: 'phr-3',
        title: 'Auto-Sugerencia',
        content: 'Programa tu mente subconsciente con afirmaciones positivas diarias. Lo que repetidamente te dices a ti mismo se convierte en tu realidad.',
        icon: '🧠'
      },
      {
        id: 'phr-4',
        title: 'Conocimiento Especializado',
        content: 'El conocimiento es poder solo cuando se organiza y dirige hacia un fin. Aprende lo que necesitas, no lo que es "interesante".',
        icon: '📚'
      },
      {
        id: 'phr-5',
        title: 'Imaginacion Creativa',
        content: 'Tu imaginacion es el taller donde se forjan todos los planes. Combina ideas existentes para crear nuevas oportunidades.',
        icon: '💡'
      },
      {
        id: 'phr-6',
        title: 'Planificacion Organizada',
        content: 'Un plan sin accion es un sueno; accion sin plan es caos. Crea un plan detallado y ejecutalo con persistencia.',
        icon: '📋'
      },
      {
        id: 'phr-7',
        title: 'La Decision Rapida',
        content: 'Los exitosos toman decisiones rapidas y las cambian lentamente. La indecision es el enemigo del progreso.',
        icon: '🎯'
      },
      {
        id: 'phr-8',
        title: 'La Persistencia',
        content: 'La persistencia es el factor clave que convierte el deseo en realidad. Sin ella, el fracaso es inevitable.',
        icon: '💪'
      }
    ],
    tasks: [
      { id: 'phr-t1', text: 'Escribe tu declaracion de proposito definitivo', completed: false },
      { id: 'phr-t2', text: 'Lee tu declaracion en voz alta dos veces al dia', completed: false },
      { id: 'phr-t3', text: 'Identifica tu deseo mas ardiente', completed: false },
      { id: 'phr-t4', text: 'Crea un plan de accion de 5 pasos', completed: false },
      { id: 'phr-t5', text: 'Practica la visualizacion diaria por 10 minutos', completed: false }
    ]
  },
  {
    id: 'hombre-rico-babilonia',
    title: 'El Hombre Mas Rico de Babilonia',
    author: 'George Clason',
    category: 'riqueza',
    cards: [
      {
        id: 'hmb-1',
        title: 'Pagate a Ti Primero',
        content: 'Guarda al menos el 10% de tus ingresos para ti. Este es el primer paso hacia la libertad financiera.',
        icon: '💰'
      },
      {
        id: 'hmb-2',
        title: 'Vive por Debajo de tus Medios',
        content: 'Controla tus gastos para que no superen tus ingresos. La diferencia es tu camino a la riqueza.',
        icon: '📊'
      },
      {
        id: 'hmb-3',
        title: 'Haz que tu Dinero Trabajue',
        content: 'Cada moneda que ahorras debe generar mas monedas. Invierte sabiamente y reinvierte las ganancias.',
        icon: '📈'
      },
      {
        id: 'hmb-4',
        title: 'Protege tu Capital',
        content: 'Consulta con expertos antes de invertir. Prioriza la seguridad sobre ganancias tentadoras.',
        icon: '🛡️'
      },
      {
        id: 'hmb-5',
        title: 'Tu Propia Casa',
        content: 'Tener tu propia casa es una inversion en libertad. Pagarte renta a ti mismo es sabio.',
        icon: '🏠'
      },
      {
        id: 'hmb-6',
        title: 'Asegura tu Futuro',
        content: 'Prepaa para la vejez y protege a tu familia. El tiempo es tu aliado cuando empiezas temprano.',
        icon: '🎯'
      },
      {
        id: 'hmb-7',
        title: 'Aumenta tu Capacidad de Ganar',
        content: 'Invierte en ti mismo. El conocimiento y las habilidades son activos que nadie te puede quitar.',
        icon: '🎓'
      },
      {
        id: 'hmb-8',
        title: 'Las 7 Maneras de Llenar una Bolsa Vacia',
        content: 'Empieza a llenar tu bolsa, controla gastos, haz oro fructificar, protege tu tesoro, posee casa, asegura futuro.',
        icon: '💎'
      }
    ],
    tasks: [
      { id: 'hmb-t1', text: 'Configura transferencia automatica del 10% al ahorro', completed: false },
      { id: 'hmb-t2', text: 'Crea un presupuesto mensual detallado', completed: false },
      { id: 'hmb-t3', text: 'Identifica 3 gastos innecesarios a eliminar', completed: false },
      { id: 'hmb-t4', text: 'Abre una cuenta de inversion', completed: false },
      { id: 'hmb-t5', text: 'Lee un libro sobre inversion basica', completed: false }
    ]
  },
  {
    id: 'padre-rico-padre-pobre',
    title: 'Padre Rico Padre Pobre',
    author: 'Robert Kiyosaki',
    category: 'riqueza',
    cards: [
      {
        id: 'prp-1',
        title: 'Activos vs Pasivos',
        content: 'Los activos ponen dinero en tu bolsillo. Los pasivos lo sacan. Los ricos compran activos, los pobres solo gastos.',
        icon: '🏦'
      },
      {
        id: 'prp-2',
        title: 'El Rat Race',
        content: 'Trabajar por dinero te atrapa. Haz que el dinero trabaje para ti. Sal de la carrera de la rata.',
        icon: '🐀'
      },
      {
        id: 'prp-3',
        title: 'Educacion Financiera',
        content: 'La escuela no ensena sobre dinero. Aprende contabilidad, inversi y mercados. Es tu responsabilidad.',
        icon: '📖'
      },
      {
        id: 'prp-4',
        title: 'Ingresos Pasivos',
        content: 'Construye flujos de ingresos que no requieran tu tiempo activo. Bienes raices, dividendos, negocios.',
        icon: '💸'
      },
      {
        id: 'prp-5',
        title: 'Tu Casa No es un Activo',
        content: 'Tu casa genera gastos, no ingresos. No la consideres tu inversion principal hacia la riqueza.',
        icon: '🏡'
      },
      {
        id: 'prp-6',
        title: 'Mente de Emprendedor',
        content: 'Los emprendedores ven oportunidades donde otros ven problemas. Desarrolla tu capacidad de resolver problemas.',
        icon: '🚀'
      },
      {
        id: 'prp-7',
        title: 'Aprende a Vender',
        content: 'Saber vender es esencial. Todos vendemos algo: ideas, productos, nosotros mismos. Domina esta habilidad.',
        icon: '🤝'
      },
      {
        id: 'prp-8',
        title: 'Trabaja para Aprender',
        content: 'No trabajes solo por el dinero. Busca trabajos que te ensenen habilidades valiosas para el futuro.',
        icon: '🎓'
      }
    ],
    tasks: [
      { id: 'prp-t1', text: 'Lista todos tus activos y pasivos actuales', completed: false },
      { id: 'prp-t2', text: 'Calcula tu patrimonio neto', completed: false },
      { id: 'prp-t3', text: 'Identifica una oportunidad de ingreso pasivo', completed: false },
      { id: 'prp-t4', text: 'Lee sobre inversion en bienes raices', completed: false },
      { id: 'prp-t5', text: 'Crea un plan para adquirir tu primer activo', completed: false }
    ]
  },
  {
    id: '7-habitos',
    title: 'Los 7 Habitos de la Gente Altamente Efectiva',
    author: 'Stephen Covey',
    category: 'desarrollo-personal',
    cards: [
      {
        id: '7h-1',
        title: 'Se Proactivo',
        content: 'Eres el arquitecto de tu vida. No culpes a circunstancias ni personas. Tu respuesta es tu poder.',
        icon: '🎯'
      },
      {
        id: '7h-2',
        title: 'Comienza con el Fin en Mente',
        content: 'Define tu mision personal. Todo se crea dos veces: primero mental, luego fisica.',
        icon: '🔭'
      },
      {
        id: '7h-3',
        title: 'Primero lo Primero',
        content: 'Prioriza lo importante sobre lo urgente. Dedica tiempo a lo que realmente importa.',
        icon: '⚡'
      },
      {
        id: '7h-4',
        title: 'Piensa Ganar-Ganar',
        content: 'Busca soluciones donde todos ganen. El exito a costa de otros es fracaso disfrazado.',
        icon: '🤝'
      },
      {
        id: '7h-5',
        title: 'Busca Primero Entender',
        content: 'Escucha para comprender, no para responder. La empatia abre puertas que el ego cierra.',
        icon: '👂'
      },
      {
        id: '7h-6',
        title: 'Sinergiza',
        content: 'El todo es mayor que la suma de las partes. Combina fortalezas para resultados extraordinarios.',
        icon: '🌟'
      },
      {
        id: '7h-7',
        title: 'Afila la Sierra',
        content: 'Renuevate fisica, mental, social y espiritualmente. El crecimiento continuo es la clave.',
        icon: '🪚'
      },
      {
        id: '7h-8',
        title: 'El Circulo de Influencia',
        content: 'Enfocate en lo que puedes controlar. Tu circulo de influencia crece cuando actueas proactivamente.',
        icon: '⭕'
      }
    ],
    tasks: [
      { id: '7h-t1', text: 'Escribe tu mision personal de vida', completed: false },
      { id: '7h-t2', text: 'Identifica tu roles principales en la vida', completed: false },
      { id: '7h-t3', text: 'Crea una matriz de prioridades semanal', completed: false },
      { id: '7h-t4', text: 'Practica escucha activa en tu proxima conversacion', completed: false },
      { id: '7h-t5', text: 'Define un objetivo ganar-ganar para esta semana', completed: false }
    ]
  },
  {
    id: 'poder-ahora',
    title: 'El Poder del Ahora',
    author: 'Eckhart Tolle',
    category: 'desarrollo-personal',
    cards: [
      {
        id: 'pa-1',
        title: 'El Presente es Todo',
        content: 'El pasado es memoria, el futuro imaginacion. Solo el ahora es real. Vivir en el presente es vivir realmente.',
        icon: '⏰'
      },
      {
        id: 'pa-2',
        title: 'Observa tu Mente',
        content: 'Tu no eres tus pensamientos. Observa tu mente sin juzgar. El observador es tu verdadero ser.',
        icon: '👁️'
      },
      {
        id: 'pa-3',
        title: 'El Dolor Emotional',
        content: 'El dolor del pasado vive en ti si te identificas con el. Sueltalo regresando al presente.',
        icon: '💔'
      },
      {
        id: 'pa-4',
        title: 'Aceptacion Total',
        content: 'Acepta el ahora completamente. Resistir lo que es genera sufrimiento. Aceptacion es paz.',
        icon: '✨'
      },
      {
        id: 'pa-5',
        title: 'El Cuerpo de Energia',
        content: 'Siente tu cuerpo desde adentro. La energia vital fluye cuando habitas tu cuerpo conscientemente.',
        icon: '⚡'
      },
      {
        id: 'pa-6',
        title: 'Mas alla del Ego',
        content: 'El ego es una construccion mental falsa. Tu verdadera identidad es presencia pura, conciencia sin limites.',
        icon: '🌌'
      },
      {
        id: 'pa-7',
        title: 'La Paciencia Eterna',
        content: 'Actua sin urgencia ni ansiedad. La paciencia no es espera, es presencia activa.',
        icon: '🌿'
      },
      {
        id: 'pa-8',
        title: 'La Muerte del Ego',
        content: 'El ego teme a la muerte y al presente. Muere al ego renaciendo al ahora en cada instante.',
        icon: '🌅'
      }
    ],
    tasks: [
      { id: 'pa-t1', text: 'Practica 5 minutos de atencion a la respiracion', completed: false },
      { id: 'pa-t2', text: 'Observa tus pensamientos por 10 minutos sin juzgar', completed: false },
      { id: 'pa-t3', text: 'Siente tu cuerpo interior por 5 minutos', completed: false },
      { id: 'pa-t4', text: 'Identifica 3 momentos donde el ego actuo', completed: false },
      { id: 'pa-t5', text: 'Practica la aceptacion total de una situacion dificil', completed: false }
    ]
  },
  {
    id: 'mindset',
    title: 'Mindset: La Psicologia del Exito',
    author: 'Carol Dweck',
    category: 'psicologia-negocios',
    cards: [
      {
        id: 'ms-1',
        title: 'Mentalidad Fija vs Crecimiento',
        content: 'Mentalidad fija: las habilidades son innatas. Mentalidad de crecimiento: las habilidades se desarrollan.',
        icon: '🧠'
      },
      {
        id: 'ms-2',
        title: 'El Poder del Aun',
        content: 'No puedes hacerlo... aun. La palabra "aun" transforma el fracaso en aprendizaje.',
        icon: '🚀'
      },
      {
        id: 'ms-3',
        title: 'Abraza el Desafio',
        content: 'Los retos no te definen, te desarrollan. Cada obstaculo es una oportunidad de crecimiento.',
        icon: '🏔️'
      },
      {
        id: 'ms-4',
        title: 'El Esfuerzo es el Camino',
        content: 'El talento sin esfuerzo es desperdicio. El esfuerzo consistente supera al talento inconsistente.',
        icon: '💪'
      },
      {
        id: 'ms-5',
        title: 'Aprende de la Critica',
        content: 'La critica no es ataque, es informacion. Usala para mejorar, no para defenderte.',
        icon: '📊'
      },
      {
        id: 'ms-6',
        title: 'El Exito de Otros Inspira',
        content: 'El exito ajeno es prueba de que es posible, no amenaza. Celebra y aprende de quienes triunfan.',
        icon: '🌟'
      },
      {
        id: 'ms-7',
        title: 'Cambia tu Dialogo Interno',
        content: 'Vigila lo que te dices a ti mismo. "No soy bueno en esto" a "Puedo mejorar en esto".',
        icon: '💬'
      },
      {
        id: 'ms-8',
        title: 'Enseña con Ejemplo',
        content: 'Modela la mentalidad de crecimiento. Tus acciones ensenan mas que tus palabras.',
        icon: '👨‍🏫'
      }
    ],
    tasks: [
      { id: 'ms-t1', text: 'Identifica 3 areas donde tienes mentalidad fija', completed: false },
      { id: 'ms-t2', text: 'Reformula 3 pensamientos limitantes', completed: false },
      { id: 'ms-t3', text: 'Acepta un desafio que hayas estado evitando', completed: false },
      { id: 'ms-t4', text: 'Pide feedback honesto sobre un proyecto', completed: false },
      { id: 'ms-t5', text: 'Escribe 5 cosas que aprendiste de un error reciente', completed: false }
    ]
  },
  {
    id: 'influencia',
    title: 'Influencia: La Psicologia de la Persuasion',
    author: 'Robert Cialdini',
    category: 'psicologia-negocios',
    cards: [
      {
        id: 'inf-1',
        title: 'Reciprocidad',
        content: 'Dar primero activa la obligacion de devolver. Un favor genera un favor mayor.',
        icon: '🎁'
      },
      {
        id: 'inf-2',
        title: 'Compromiso y Coherencia',
        content: 'Los compromisos pequenos llevan a grandes. La coherencia con decisiones pasadas guia el comportamiento.',
        icon: '🔗'
      },
      {
        id: 'inf-3',
        title: 'Prueba Social',
        content: 'Seguimos a los demas cuando no estamos seguros. "Muchos lo hacen" es poderoso.',
        icon: '👥'
      },
      {
        id: 'inf-4',
        title: 'Autoridad',
        content: 'Respetamos la experticia. Titulos, uniformes y credenciales activan obediencia automatica.',
        icon: '🎖️'
      },
      {
        id: 'inf-5',
        title: 'Escasez',
        content: 'Lo raro es valioso. "Tiempo limitado" y "ultimas unidades" aceleran decisiones.',
        icon: '⏳'
      },
      {
        id: 'inf-6',
        title: 'Simpatia',
        content: 'Decimos si a quienes nos agradan. Similitud, elogios y familiaridad generan simpatia.',
        icon: '❤️'
      },
      {
        id: 'inf-7',
        title: 'Defiende tu Atencion',
        content: 'Conocer estos principios te protege. Pausa antes de decidir bajo presion.',
        icon: '🛡️'
      },
      {
        id: 'inf-8',
        title: 'Etica en la Influencia',
        content: 'Usa estos principios con integridad. La manipulacion genera desconfianza duradera.',
        icon: '⚖️'
      }
    ],
    tasks: [
      { id: 'inf-t1', text: 'Identifica como usas reciprocidad en tu vida', completed: false },
      { id: 'inf-t2', text: 'Analiza un anuncio usando los 6 principios', completed: false },
      { id: 'inf-t3', text: 'Practica conseguir un compromiso pequeno', completed: false },
      { id: 'inf-t4', text: 'Identifica 3 situaciones donde la prueba social te afecta', completed: false },
      { id: 'inf-t5', text: 'Crea una estrategia de influencia etica para un objetivo', completed: false }
    ]
  },
  {
    id: 'lean-startup',
    title: 'El Metodo Lean Startup',
    author: 'Eric Ries',
    category: 'emprendimiento',
    cards: [
      {
        id: 'ls-1',
        title: 'El Producto Minimo Viable',
        content: 'No construy el producto perfecto. Crea lo minimo para aprender de clientes reales.',
        icon: '🎯'
      },
      {
        id: 'ls-2',
        title: 'Construir-Medir-Aprender',
        content: 'El ciclo fundamental del emprendimiento. Rapidez de aprendizaje sobre velocidad de ejecucion.',
        icon: '🔄'
      },
      {
        id: 'ls-3',
        title: 'Pivotear o Perseverar',
        content: 'Los datos guian la decision. Cambiar de direccion no es fracaso, es evolucion.',
        icon: '🔀'
      },
      {
        id: 'ls-4',
        title: 'Hipotesis de Valor y Crecimiento',
        content: 'Valida que clientes quieren (valor) y que compraran (crecimiento). Sin validacion, solo suposiciones.',
        icon: '📊'
      },
      {
        id: 'ls-5',
        title: 'Metricas Vanguardia',
        content: 'Olvída las metricas de vanidad. Mide retencion, compromiso y conversion real.',
        icon: '📈'
      },
      {
        id: 'ls-6',
        title: 'El Motor de Crecimiento',
        content: 'Identifica como creceras: boca a boca, viral, pago o pegajoso. Uno a la vez.',
        icon: '⚙️'
      },
      {
        id: 'ls-7',
        title: 'El Lote Pequeno',
        content: 'Trabaja en lotes pequenos. Menos inventario, mas velocidad, menos riesgo.',
        icon: '📦'
      },
      {
        id: 'ls-8',
        title: 'Innovacion en el Modelo',
        content: 'El producto no es lo unico que importa. El modelo de negocio puede ser tu ventaja.',
        icon: '💡'
      }
    ],
    tasks: [
      { id: 'ls-t1', text: 'Define tu hipotesis de valor principal', completed: false },
      { id: 'ls-t2', text: 'Identifica el PMV mas simple posible', completed: false },
      { id: 'ls-t3', text: 'Establece 3 metricas de vanguardia', completed: false },
      { id: 'ls-t4', text: 'Realiza 5 entrevistas a clientes potenciales', completed: false },
      { id: 'ls-t5', text: 'Determina tu motor de crecimiento principal', completed: false }
    ]
  },
  {
    id: 'cero-a-uno',
    title: 'De Cero a Uno',
    author: 'Peter Thiel',
    category: 'emprendimiento',
    cards: [
      {
        id: 'c01-1',
        title: 'Progreso Vertical vs Horizontal',
        content: 'Horizontal: copiar lo que funciona (1 a n). Vertical: crear algo nuevo (0 a 1). Busca lo segundo.',
        icon: '🆙'
      },
      {
        id: 'c01-2',
        title: 'El Monopolio Creativo',
        content: 'La competencia es para perdedores. Busca dominar un nicho pequeno y expandir desde ahi.',
        icon: '👑'
      },
      {
        id: 'c01-3',
        title: 'El Poder de las Leyes',
        content: 'Pocos eventos generan la mayoria de resultados. Identifica tus decisiones de ley de potencias.',
        icon: '📊'
      },
      {
        id: 'c01-4',
        title: 'Secretos Importan',
        content: 'El valor esta en lo que nadie sabe. Busca secretos sobre productos, clientes o mercados.',
        icon: '🔐'
      },
      {
        id: 'c01-5',
        title: 'La Fundacion Correcta',
        content: 'Los primeros miembros definen la cultura. Elige cofundadores como eliges pareja de matrimonio.',
        icon: '🏗️'
      },
      {
        id: 'c01-6',
        title: 'Construye una Maquina del Tiempo',
        content: 'Crea algo que sera indispensable en 10 anos. Si funciona hoy, ya es tarde.',
        icon: '⏰'
      },
      {
        id: 'c01-7',
        title: 'Vendas es Pecado',
        content: 'Tecnologia sin distribucion falla. La mejor solucion sin ventas es una solucion que nadie usa.',
        icon: '💰'
      },
      {
        id: 'c01-8',
        title: 'Siete Preguntas Clave',
        content: 'Ingenieria, timing, monopolio, gente, distribucion, durabilidad, secreto. Las 7 deben tener respuesta.',
        icon: '❓'
      }
    ],
    tasks: [
      { id: 'c01-t1', text: 'Define como tu idea es 0 a 1, no 1 a n', completed: false },
      { id: 'c01-t2', text: 'Identifica tu monopolio potencial en un nicho', completed: false },
      { id: 'c01-t3', text: 'Descubre un secreto sobre tu mercado', completed: false },
      { id: 'c01-t4', text: 'Responde las 7 preguntas clave de Thiel', completed: false },
      { id: 'c01-t5', text: 'Define tu ventaja de 10 anos', completed: false }
    ]
  },
  {
    id: 'efecto-compuesto',
    title: 'El Efecto Compuesto',
    author: 'Darren Hardy',
    category: 'desarrollo-personal',
    cards: [
      {
        id: 'ec-1',
        title: 'Pequenas Acciones, Grandes Resultados',
        content: 'Pequenas decisiones diarias, repetidas, generan resultados masivos. El tiempo multiplica todo.',
        icon: '🌱'
      },
      {
        id: 'ec-2',
        title: 'La Matematica del Exito',
        content: 'Mejorar 1% cada dia = 37x mejor en un ano. La consistencia supera la intensidad.',
        icon: '📈'
      },
      {
        id: 'ec-3',
        title: 'Elecciones + Comportamiento + Habitos',
        content: 'El exito es la suma de buenas elecciones, comportamientos correctos y habitos solidos.',
        icon: '➕'
      },
      {
        id: 'ec-4',
        title: 'Momentum es Magia',
        content: 'La consistencia crea momentum. Una vez que empiezas, es mas facil continuar que parar.',
        icon: '🎡'
      },
      {
        id: 'ec-5',
        title: 'Influencias Importan',
        content: 'Tu entorno te forma. Rodeate de personas, lugares e informacion que te eleven.',
        icon: '👥'
      },
      {
        id: 'ec-6',
        title: 'Asumelo Todo',
        content: 'La responsabilidad total es libertad. Culpar es rendir tu poder. Asume todo.',
        icon: '💪'
      },
      {
        id: 'ec-7',
        title: 'Rutinas de la Manana',
        content: 'Como empiezas el dia determina el dia. Una rutina de manana gobierna tu vida.',
        icon: '🌅'
      },
      {
        id: 'ec-8',
        title: 'Registra para Mejorar',
        content: 'Lo que no se mide no se mejora. Registra tus habitos, gastos, tiempo. Los datos revelan patrones.',
        icon: '📝'
      }
    ],
    tasks: [
      { id: 'ec-t1', text: 'Identifica 3 pequenas acciones diarias para mejorar', completed: false },
      { id: 'ec-t2', text: 'Crea tu rutina de manana ideal', completed: false },
      { id: 'ec-t3', text: 'Elimina una influencia negativa de tu vida', completed: false },
      { id: 'ec-t4', text: 'Empieza a registrar un habito importante', completed: false },
      { id: 'ec-t5', text: 'Comprometete a mejorar 1% esta semana', completed: false }
    ]
  },
  {
    id: 'magia-pensar-grande',
    title: 'La Magia de Pensar en Grande',
    author: 'David Schwartz',
    category: 'desarrollo-personal',
    cards: [
      {
        id: 'mtg-1',
        title: 'Cree que Puedes',
        content: 'Tu tamano de pensamiento determina tu tamano de exito. Primero cree, luego logra.',
        icon: '💭'
      },
      {
        id: 'mtg-2',
        title: 'Cura la Excusitis',
        content: 'Las excusas son la enfermedad del fracaso. Salud, inteligencia, edad, suerte: todas son mentiras.',
        icon: '💊'
      },
      {
        id: 'mtg-3',
        title: 'Piensa y Suenia en Grande',
        content: 'No hay esfuerzo extra en sonar en grande. Los costos son iguales, los resultados no.',
        icon: '🌟'
      },
      {
        id: 'mtg-4',
        title: 'Tu Actitud Define Tu Altura',
        content: 'La actitud correcta transforma obstaculos en oportunidades. Piensa positivo, actue positivo.',
        icon: '🧗'
      },
      {
        id: 'mtg-5',
        title: 'Crea Zonas de Pensamiento',
        content: 'Dedica tiempo exclusivo a pensar. Grandes ideas requieren espacio mental.',
        icon: '🧠'
      },
      {
        id: 'mtg-6',
        title: 'Accion Constructora',
        content: 'Las ideas sin accion mueren. El miedo desaparece cuando actueas.',
        icon: '🚀'
      },
      {
        id: 'mtg-7',
        title: 'Gana Amigos e Influencia',
        content: 'El exito requiere otros. Toma interes genuino en la gente. Se el que recuerda nombres.',
        icon: '🤝'
      },
      {
        id: 'mtg-8',
        title: 'Piensa Como un Lider',
        content: 'Los lideres piensan en terminos de servicio. Empieza donde estas, usa lo que tienes.',
        icon: '👑'
      }
    ],
    tasks: [
      { id: 'mtg-t1', text: 'Identifica y elimina tus 3 excusas principales', completed: false },
      { id: 'mtg-t2', text: 'Escribe una meta ambiciosa para 5 anos', completed: false },
      { id: 'mtg-t3', text: 'Dedica 30 minutos a pensar sin distracciones', completed: false },
      { id: 'mtg-t4', text: 'Practica recordar nombres esta semana', completed: false },
      { id: 'mtg-t5', text: 'Define como puedes servir mejor a otros', completed: false }
    ]
  },
  {
    id: 'steve-jobs',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    category: 'historias-exito',
    cards: [
      {
        id: 'sj-1',
        title: 'Pasion es el Combustible',
        content: 'Sin pasion, cualquier racional te hace rendir. La pasion te mantiene cuando todo parece perdido.',
        icon: '🔥'
      },
      {
        id: 'sj-2',
        title: 'Simplificar es lo Ultimo',
        content: 'La simplicidad es la maxima sofisticacion. Elimina, reduce, hasta que no puedas mas.',
        icon: '✨'
      },
      {
        id: 'sj-3',
        title: 'El Campo de Distorsion',
        content: 'Cree algo tan intensamente que la realidad se ajuste. La conviccion mueve montanas.',
        icon: '🌀'
      },
      {
        id: 'sj-4',
        title: 'Perfeccionismo Sin Compromiso',
        content: 'No aceptes "bueno". Solo lo excelente sobrevive. Los detalles que nadie ve importan.',
        icon: '💎'
      },
      {
        id: 'sj-5',
        title: 'Interseccion de Arte y Tecnologia',
        content: 'La magia ocurre donde humanidades y ciencias se encuentran. No elijas, integra.',
        icon: '🎨'
      },
      {
        id: 'sj-6',
        title: 'El Fracaso es Curriculum',
        content: 'Ser despedido de Apple lo libero. El fracaso puede ser el mejor maestro.',
        icon: '📉'
      },
      {
        id: 'sj-7',
        title: 'Quedate Hambriento, Quedate Tonto',
        content: 'Nunca te conformes. Mantente curioso, arriesgado y dispuesto a equivocarte.',
        icon: '🍎'
      },
      {
        id: 'sj-8',
        title: 'Productos Primero',
        content: 'No dejes que el marketing domine. Crea productos increibles, el marketing seguira.',
        icon: '📱'
      }
    ],
    tasks: [
      { id: 'sj-t1', text: 'Identifica tu pasion fundamental', completed: false },
      { id: 'sj-t2', text: 'Simplifica un proyecto complejo', completed: false },
      { id: 'sj-t3', text: 'Revisa un trabajo "terminado" y mejoralo', completed: false },
      { id: 'sj-t4', text: 'Identifica donde estas aceptando "bueno"', completed: false },
      { id: 'sj-t5', text: 'Toma una decision basada en pasion, no logica', completed: false }
    ]
  },
  {
    id: 'shoe-dog',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    category: 'historias-exito',
    cards: [
      {
        id: 'sd-1',
        title: 'El Llamado de la Idea',
        content: 'Cuando una idea no te deja dormir, es tu camino. Knight sabia que los zapatos eran su destino.',
        icon: '👟'
      },
      {
        id: 'sd-2',
        title: 'La Mentira del Exito Facil',
        content: 'El camino es duro, solitario y aterrador. Los que triunfan son los que no se rinden.',
        icon: '🏔️'
      },
      {
        id: 'sd-3',
        title: 'El Equipo es Todo',
        content: 'Los Buck y los primeros empleados no eran perfectos. Eran leales y complementarios.',
        icon: '🤝'
      },
      {
        id: 'sd-4',
        title: 'Crisis es Normalidad',
        content: 'Problemas bancarios, competencia, conflictos: siempre habra crisis. Aprend a navegarlas.',
        icon: '🌊'
      },
      {
        id: 'sd-5',
        title: 'Innovacion Constante',
        content: 'Nunca te conformes con lo que funciona hoy. Nike siempre busco el siguiente zapato.',
        icon: '💡'
      },
      {
        id: 'sd-6',
        title: 'La Importancia del Branding',
        content: 'El swoosh, "Just Do It": la marca es mas que el producto. Invierte en identidad.',
        icon: '✓'
      },
      {
        id: 'sd-7',
        title: 'Mantente Cercano al Producto',
        content: 'Knight siempre fue corredor. Conoce tu producto desde adentro. La autenticidad importa.',
        icon: '🏃'
      },
      {
        id: 'sd-8',
        title: 'El Valor de la Persistencia',
        content: 'Casi quiebra docenas de veces. La diferencia entre exito y fracaso es seguir un dia mas.',
        icon: '💪'
      }
    ],
    tasks: [
      { id: 'sd-t1', text: 'Identifica la idea que no te deja dormir', completed: false },
      { id: 'sd-t2', text: 'Evalua tu equipo: son los correctos?', completed: false },
      { id: 'sd-t3', text: 'Construye una crisis en tu plan y prepara solucion', completed: false },
      { id: 'sd-t4', text: 'Define un elemento de marca para tu proyecto', completed: false },
      { id: 'sd-t5', text: 'Comprometete a persistir un mes mas en un reto', completed: false }
    ]
  },
  {
    id: 'coaching-efectivo',
    title: 'El Coaching Efectivo',
    author: 'John Whitmore',
    category: 'coaching',
    cards: [
      {
        id: 'ce-1',
        title: 'Preguntas, No Respuestas',
        content: 'El coach no resuelve, pregunta. Las preguntas despiertan conciencia y responsabilidad.',
        icon: '❓'
      },
      {
        id: 'ce-2',
        title: 'El Modelo GROW',
        content: 'Goal (meta), Reality (realidad), Options (opciones), Will (voluntad). Un marco para cualquier sesion.',
        icon: '🎯'
      },
      {
        id: 'ce-3',
        title: 'Escucha Activa',
        content: 'Escucha para entender, no para responder. El silencio es tan valioso como las palabras.',
        icon: '👂'
      },
      {
        id: 'ce-4',
        title: 'Conciencia y Responsabilidad',
        content: 'El coaching genera这两样. Sin conciencia no hay cambio, sin responsabilidad no hay accion.',
        icon: '👁️'
      },
      {
        id: 'ce-5',
        title: 'Feedback Constructivo',
        content: 'El feedback es un regalo. Ofrecelo con cuidado, recibelo con apertura.',
        icon: '🎁'
      },
      {
        id: 'ce-6',
        title: 'El Coach no es Experto',
        content: 'El coachee es el experto de su vida. El coach facilita, no dicta soluciones.',
        icon: '🧭'
      },
      {
        id: 'ce-7',
        title: 'Metas SMART y Mas',
        content: 'Especificas, Medibles, Alcanzables, Relevantes, Temporales. Pero tambien inspiradoras.',
        icon: '⭐'
      },
      {
        id: 'ce-8',
        title: 'El Coaching es un Estilo',
        content: 'No solo una sesion formal. Liderar con estilo de coaching transforma equipos.',
        icon: '👥'
      }
    ],
    tasks: [
      { id: 'ce-t1', text: 'Practica el modelo GROW contigo mismo', completed: false },
      { id: 'ce-t2', text: 'Haz 5 preguntas poderosas esta semana', completed: false },
      { id: 'ce-t3', text: 'Practica escuchar sin interrumpir', completed: false },
      { id: 'ce-t4', text: 'Ofrece feedback usando el modelo sándwich', completed: false },
      { id: 'ce-t5', text: 'Identifica un momento para usar estilo de coaching', completed: false }
    ]
  },
  {
    id: '4-acuerdos',
    title: 'Los 4 Acuerdos',
    author: 'Don Miguel Ruiz',
    category: 'desarrollo-personal',
    cards: [
      {
        id: '4a-1',
        title: 'Se Impecable con Tu Palabra',
        content: 'Tu palabra es tu poder. No la uses contra ti ni contra otros. La palabra crea y destruye.',
        icon: '💬'
      },
      {
        id: '4a-2',
        title: 'No Te Tomes Nada Personal',
        content: 'Lo que otros hacen es sobre ellos, no sobre ti. Su opinion refleja su mundo, no el tuyo.',
        icon: '🛡️'
      },
      {
        id: '4a-3',
        title: 'No Hagas Suposiciones',
        content: 'Asumir genera conflicto. Pregunta. Comunica claro. La verdad requiere valentia.',
        icon: '❓'
      },
      {
        id: '4a-4',
        title: 'Haz Siempre tu Mejor',
        content: 'Tu mejor varia dia a dia. Hazlo sin juzgarte. El esfuerzo correcto evita culpas.',
        icon: '⭐'
      },
      {
        id: '4a-5',
        title: 'El Parasito Mental',
        content: 'El miedo, la culpa y la verguenza son parasitos. Desalojalos rompiendo acuerdos viejos.',
        icon: '🐛'
      },
      {
        id: '4a-6',
        title: 'El Primer Acuerdo es Base',
        content: 'Sin impecabilidad, los demas acuerdos fallan. Tu palabra contigo mismo es la mas importante.',
        icon: '基石'
      },
      {
        id: '4a-7',
        title: 'Domestication del Ser',
        content: 'Fuiste domesticado con premios y castigos. Desaprende lo que no te sirve.',
        icon: '🦋'
      },
      {
        id: '4a-8',
        title: 'El Cielo en la Tierra',
        content: 'El cielo es un estado mental. Los 4 acuerdos son el camino. Libertad es vivirlos.',
        icon: '🌈'
      }
    ],
    tasks: [
      { id: '4a-t1', text: 'Hoy, usa solo palabras impecables contigo', completed: false },
      { id: '4a-t2', text: 'Identifica algo que tomaste personal y soltalo', completed: false },
      { id: '4a-t3', text: 'Haz una pregunta donde solias asumir', completed: false },
      { id: '4a-t4', text: 'Define que es "tu mejor" hoy', completed: false },
      { id: '4a-t5', text: 'Escribe un acuerdo viejo que romper', completed: false }
    ]
  },
  {
    id: 'ganar-amigos',
    title: 'Como Ganar Amigos e Influir en las Personas',
    author: 'Dale Carnegie',
    category: 'psicologia-negocios',
    cards: [
      {
        id: 'ga-1',
        title: 'No Critiques ni Te Quejes',
        content: 'La critica pone a la defensiva. En lugar de juzgar, intenta entender.',
        icon: '🤐'
      },
      {
        id: 'ga-2',
        title: 'Aprecia Genuinamente',
        content: 'El deseo mas profundo es sentirse importante. Elogia con sinceridad, no con halago.',
        icon: '❤️'
      },
      {
        id: 'ga-3',
        title: 'Despierta el Deseo',
        content: 'Para influir, conecta con lo que el otro quiere. Habla de sus intereses, no de los tuyos.',
        icon: '🎯'
      },
      {
        id: 'ga-4',
        title: 'Sonrie',
        content: 'Una sonrisa genuina abre puertas. Los demas responden a tu energia antes que a tus palabras.',
        icon: '😊'
      },
      {
        id: 'ga-5',
        title: 'Recuerda Nombres',
        content: 'El nombre es el sonido mas dulce. Recordarlo dice "importas para mi".',
        icon: '📛'
      },
      {
        id: 'ga-6',
        title: 'Escucha Interesadamente',
        content: 'Para ser interesante, se interesado. Escucha mas de lo que hablas.',
        icon: '👂'
      },
      {
        id: 'ga-7',
        title: 'Haz Sentir Importante al Otro',
        content: 'Trata a cada persona como si fuera la mas importante de tu dia. Lo es.',
        icon: '👑'
      },
      {
        id: 'ga-8',
        title: 'Evita Argumentos',
        content: 'Ganar un argumento es perder un aliado. El unico modo de ganar es evitarlo.',
        icon: '✌️'
      }
    ],
    tasks: [
      { id: 'ga-t1', text: 'Hoy, no critiques ni te quejes', completed: false },
      { id: 'ga-t2', text: 'Da 3 elogios genuinos hoy', completed: false },
      { id: 'ga-t3', text: 'Aprende y usa 5 nombres nuevos esta semana', completed: false },
      { id: 'ga-t4', text: 'En tu proxima conversacion, escucha 80% del tiempo', completed: false },
      { id: 'ga-t5', text: 'Evita un argumento buscando common ground', completed: false }
    ]
  },
  // GERENCIA
  {
    id: 'la-meta',
    title: 'La Meta',
    author: 'Eliyahu Goldratt',
    category: 'gerencia',
    cards: [
      {
        id: 'lg-1',
        title: 'La Meta es Ganar Dinero',
        content: 'El objetivo de toda empresa es ganar dinero. Todo lo demas es medio. La meta no es eficiencia, es rentabilidad.',
        icon: '🎯'
      },
      {
        id: 'lg-2',
        title: 'Teoria de Restricciones',
        content: 'Cada sistema tiene al menos un cuello de botella. Mejorar el cuello de botella mejora todo el sistema.',
        icon: '🔗'
      },
      {
        id: 'lg-3',
        title: 'Cuellos de Botella',
        content: 'Identifica el recurso mas lento. La capacidad del sistema entero depende de el. Protegelo.',
        icon: '⏳'
      },
      {
        id: 'lg-4',
        title: 'Inventario vs Produccion',
        content: 'El inventario excesivo oculta problemas. Reduce inventario para revelar ineficiencias.',
        icon: '📦'
      },
      {
        id: 'lg-5',
        title: 'Gastos de Operacion',
        content: 'Todo gasto que no contribuye a la meta es desperdicio. Clasifica: productivo o no productivo.',
        icon: '💰'
      },
      {
        id: 'lg-6',
        title: 'Flujo Continuo',
        content: 'El objetivo es que el material fluya sin interrupciones. Paradas y esperas son enemigos.',
        icon: '🌊'
      },
      {
        id: 'lg-7',
        title: 'Processos en Paralelo',
        content: 'El tiempo total lo define el proceso mas largo. Paralelizar no siempre ayuda.',
        icon: '⚡'
      },
      {
        id: 'lg-8',
        title: 'Mejora Continua',
        content: 'La meta nunca se alcanza definitivamente. Siempre hay una nueva restriccion que gestionar.',
        icon: '📈'
      }
    ],
    tasks: [
      { id: 'lg-t1', text: 'Identifica el cuello de botella en tu trabajo', completed: false },
      { id: 'lg-t2', text: 'Mide el flujo de valor en tu proceso principal', completed: false },
      { id: 'lg-t3', text: 'Lista 3 restricciones actuales en tu equipo', completed: false },
      { id: 'lg-t4', text: 'Calcula el impacto del cuello de botella', completed: false },
      { id: 'lg-t5', text: 'Propor una solucion para la restriccion principal', completed: false }
    ]
  },
  {
    id: 'ejecutivo-efectivo',
    title: 'El Ejecutivo Efectivo',
    author: 'Peter Drucker',
    category: 'gerencia',
    cards: [
      {
        id: 'ee-1',
        title: 'Eficacia es un Habito',
        content: 'La efectividad se aprende, no se nace con ella. Es una practica, no un talento innato.',
        icon: '🎯'
      },
      {
        id: 'ee-2',
        title: 'Conoce tu Tiempo',
        content: 'El tiempo es el recurso mas escaso. Registralo, gestionalo, consolidalo en bloques grandes.',
        icon: '⏰'
      },
      {
        id: 'ee-3',
        title: 'Enfocate en Contribucion',
        content: 'No preguntes que quieres hacer. Pregunta que contribucion se espera de ti.',
        icon: '🎁'
      },
      {
        id: 'ee-4',
        title: 'Fortalezas, No Debilidades',
        content: 'El ejecutivo efectivo construye sobre fortalezas. Las debilidades se gestionan, no se corrigen.',
        icon: '💪'
      },
      {
        id: 'ee-5',
        title: 'Primero lo Primero',
        content: 'Concentrate en lo importante. Multitarea es mito. Una cosa a la vez, la mas importante primero.',
        icon: '1️⃣'
      },
      {
        id: 'ee-6',
        title: 'Decisiones Efectivas',
        content: 'Pocas decisiones fundamentales, no muchas pequenas. La calidad supera a la cantidad.',
        icon: '✅'
      },
      {
        id: 'ee-7',
        title: 'Consenso vs Accion',
        content: 'El consenso no es objetivo. La decision correcta ejecutada supera la perfecta sin accion.',
        icon: '🤝'
      },
      {
        id: 'ee-8',
        title: 'Responsabilidad por Resultados',
        content: 'El ejecutivo mide su efectividad por resultados, no por actividad. Outputs sobre inputs.',
        icon: '📊'
      }
    ],
    tasks: [
      { id: 'ee-t1', text: 'Registra tu tiempo por 3 dias en detalle', completed: false },
      { id: 'ee-t2', text: 'Identifica tu principal contribucion esperada', completed: false },
      { id: 'ee-t3', text: 'Lista tus 3 fortalezas y como usarlas mas', completed: false },
      { id: 'ee-t4', text: 'Elimina una tarea que no aporta valor', completed: false },
      { id: 'ee-t5', text: 'Toma una decision importante que has pospuesto', completed: false }
    ]
  },
  {
    id: 'rompa-reglas',
    title: 'Primero Rompa Todas las Reglas',
    author: 'Marcus Buckingham',
    category: 'gerencia',
    cards: [
      {
        id: 'rr-1',
        title: 'Las Reglas Tradicionales Fallan',
        content: 'Tratar a todos igual es injusto. Cada empleado es unico y requiere enfoque personalizado.',
        icon: '🔨'
      },
      {
        id: 'rr-2',
        title: 'Talento vs Habilidad',
        content: 'Talento es natural, habilidad se aprende. Contrata por talento, entrena la habilidad.',
        icon: '⭐'
      },
      {
        id: 'rr-3',
        title: 'El Gerente Importa',
        content: 'La gente renuncia a gerentes, no a empresas. El jefe directo determina el compromiso.',
        icon: '👔'
      },
      {
        id: 'rr-4',
        title: 'Enfocate en Fortalezas',
        content: 'El mejor gerente descubre fortalezas y las amplifica. No intenta corregir debilidades.',
        icon: '🎯'
      },
      {
        id: 'rr-5',
        title: 'Define los Resultados',
        content: 'Dicta el que, no el como. Da autonomia en el metodo, claridad en el resultado.',
        icon: '🏁'
      },
      {
        id: 'rr-6',
        title: 'Los 12 Indicadores',
        content: 'Conoce las 12 preguntas que miden el compromiso. Si tu equipo las responde bien, ganaste.',
        icon: '❓'
      },
      {
        id: 'rr-7',
        title: 'El Jefe del Gerente',
        content: 'El rol del jefe es eliminar obstaculos, no agregar capas. Simplificar, no complicar.',
        icon: '🚧'
      },
      {
        id: 'rr-8',
        title: 'Cultura de Individualidad',
        content: 'Celebra la diferencia. Equipos diversos con roles claros superan a clones uniformes.',
        icon: '🎨'
      }
    ],
    tasks: [
      { id: 'rr-t1', text: 'Identifica el talento principal de cada miembro de tu equipo', completed: false },
      { id: 'rr-t2', text: 'Aplica las 12 preguntas de compromiso con tu equipo', completed: false },
      { id: 'rr-t3', text: 'Define resultados claros, no pasos a seguir', completed: false },
      { id: 'rr-t4', text: 'Crea un plan de desarrollo basado en fortalezas', completed: false },
      { id: 'rr-t5', text: 'Identifica que obstaculos puedes eliminar para tu equipo', completed: false }
    ]
  },
  {
    id: 'liderazgo-limite',
    title: 'Liderazgo sin Titulo',
    author: 'Robin Sharma',
    category: 'gerencia',
    cards: [
      {
        id: 'll-1',
        title: 'No Necesitas Titulo',
        content: 'El liderazgo no es posicion, es accion. Cualquiera puede liderar desde cualquier lugar.',
        icon: '👑'
      },
      {
        id: 'll-2',
        title: 'Modela el Ejemplo',
        content: 'Se el cambio que quieres ver. Tu comportamiento ensena mas que tus palabras.',
        icon: '🪞'
      },
      {
        id: 'll-3',
        title: 'Excelencia Diaria',
        content: 'La grandeza es el resultado de pequenas acciones excelentes repetidas cada dia.',
        icon: '✨'
      },
      {
        id: 'll-4',
        title: 'Innovacion Constante',
        content: 'El lider siempre busca mejorar lo establecido. El status quo es enemigo.',
        icon: '💡'
      },
      {
        id: 'll-5',
        title: 'Servicio a Otros',
        content: 'Liderar es servir. El mejor lider es el que mas contribuye al exito de otros.',
        icon: '🤝'
      },
      {
        id: 'll-6',
        title: 'Resiliencia ante Adversidad',
        content: 'Las crisis revelan lideres. Mantente firme cuando otros se derrumban.',
        icon: '🌊'
      },
      {
        id: 'll-7',
        title: 'Maestria Personal',
        content: 'No puedes liderar a otros sin liderarte a ti. Autodisciplina es fundamento.',
        icon: '🧘'
      },
      {
        id: 'll-8',
        title: 'Legado Duradero',
        content: 'El verdadero exito es dejar las cosas mejor de como las encontraste.',
        icon: '🏆'
      }
    ],
    tasks: [
      { id: 'll-t1', text: 'Identifica 3 formas de liderar sin autoridad formal', completed: false },
      { id: 'll-t2', text: 'Practica la excelencia en una tarea pequena hoy', completed: false },
      { id: 'll-t3', text: 'Ayuda a un colega sin esperar nada a cambio', completed: false },
      { id: 'll-t4', text: 'Define que legado quieres dejar en tu rol actual', completed: false },
      { id: 'll-t5', text: 'Mejora un proceso que todos aceptan como "siempre ha sido asi"', completed: false }
    ]
  },
  // MANEJO DE PROYECTOS
  {
    id: 'scrum',
    title: 'Scrum: El Arte de Hacer el Doble',
    author: 'Jeff Sutherland',
    category: 'manejo-proyectos',
    cards: [
      {
        id: 'sc-1',
        title: 'Sprints Cortos',
        content: 'Trabaja en ciclos de 1-4 semanas. Entrega algo funcional cada sprint. Feedback rapido, adaptacion rapida.',
        icon: '🔄'
      },
      {
        id: 'sc-2',
        title: 'Roles Claros',
        content: 'Product Owner decide el que. Scrum Master facilita. Equipo ejecuta. Sin confusion de responsabilidades.',
        icon: '👥'
      },
      {
        id: 'sc-3',
        title: 'El Product Backlog',
        content: 'Todo trabajo esta en el backlog. Priorizado por valor. El equipo toma lo que puede completar.',
        icon: '📋'
      },
      {
        id: 'sc-4',
        title: 'Daily Standup',
        content: '15 minutos diarios. Que hice, que hare, que obstaculos tengo. Sincronizacion, no reporte.',
        icon: '🧍'
      },
      {
        id: 'sc-5',
        title: 'Velocidad del Equipo',
        content: 'Mide cuantas tareas completa el equipo por sprint. Usa datos historicos para planificar.',
        icon: '⚡'
      },
      {
        id: 'sc-6',
        title: 'Retrospectivas',
        content: 'Al final de cada sprint, analiza que funciono y que no. Mejora continua del proceso.',
        icon: '🔍'
      },
      {
        id: 'sc-7',
        title: 'Definicion de Hecho',
        content: 'El equipo define que significa "terminado". Sin ambiguedad. Calidad no se negocia.',
        icon: '✅'
      },
      {
        id: 'sc-8',
        title: 'Eliminar Impedimentos',
        content: 'El Scrum Master elimina obstaculos. Nada debe bloquear al equipo. Protege el enfoque.',
        icon: '🚧'
      }
    ],
    tasks: [
      { id: 'sc-t1', text: 'Define la duracion ideal de sprint para tu proyecto', completed: false },
      { id: 'sc-t2', text: 'Crea un product backlog priorizado', completed: false },
      { id: 'sc-t3', text: 'Implementa daily standups de 15 minutos', completed: false },
      { id: 'sc-t4', text: 'Mide la velocidad del equipo en 3 sprints', completed: false },
      { id: 'sc-t5', text: 'Conduce una retrospectiva y define una mejora', completed: false }
    ]
  },
  {
    id: 'gtd',
    title: 'Getting Things Done',
    author: 'David Allen',
    category: 'manejo-proyectos',
    cards: [
      {
        id: 'gtd-1',
        title: 'Capturar Todo',
        content: 'Tu mente es para tener ideas, no para guardarlas. Captura todo en un sistema externo confiable.',
        icon: '📥'
      },
      {
        id: 'gtd-2',
        title: 'Aclarar, No Solo Organizar',
        content: 'No basta con guardar. Procesa cada item: que es? que significa? que hago con eso?',
        icon: '🔍'
      },
      {
        id: 'gtd-3',
        title: 'La Siguiente Accion',
        content: 'Todo proyecto se reduce a la proxima accion fisica concreta. Define el siguiente paso.',
        icon: '➡️'
      },
      {
        id: 'gtd-4',
        title: 'Contextos',
        content: 'Organiza por donde y con que haces las tareas. En oficina, con computadora, llamadas, etc.',
        icon: '📍'
      },
      {
        id: 'gtd-5',
        title: 'El Tickler File',
        content: 'El sistema de 43 carpetas: 31 dias + 12 meses. Guarda recordatorios futuros.',
        icon: '📁'
      },
      {
        id: 'gtd-6',
        title: 'Revision Semanal',
        content: 'Una vez por semana, revisa todo tu sistema. Limpia, actualiza, clarifica. Es esencial.',
        icon: '📅'
      },
      {
        id: 'gtd-7',
        title: 'Dos Minutos',
        content: 'Si una tarea toma menos de 2 minutos, hazla ahora. No la organices, ejecutala.',
        icon: '⏱️'
      },
      {
        id: 'gtd-8',
        title: 'Proyectos vs Tareas',
        content: 'Proyecto: cualquier resultado que requiere multiples pasos. Definelo y proxima accion.',
        icon: '📊'
      }
    ],
    tasks: [
      { id: 'gtd-t1', text: 'Crea un sistema de captura que siempre tengas a mano', completed: false },
      { id: 'gtd-t2', text: 'Procesa tu bandeja de entrada hasta vaciarla', completed: false },
      { id: 'gtd-t3', text: 'Define la siguiente accion para cada proyecto activo', completed: false },
      { id: 'gtd-t4', text: 'Implementa la revision semanal en tu calendario', completed: false },
      { id: 'gtd-t5', text: 'Organiza tus tareas por contexto', completed: false }
    ]
  },
  {
    id: 'okr',
    title: 'Mide lo que Importa',
    author: 'John Doerr',
    category: 'manejo-proyectos',
    cards: [
      {
        id: 'okr-1',
        title: 'Objectivos y Resultados Clave',
        content: 'Objetivo: que quieres lograr. Resultados clave: como mides el exito. Ambiciosos y medibles.',
        icon: '🎯'
      },
      {
        id: 'okr-2',
        title: 'Objectivos Ambiciosos',
        content: 'Los OKRs deben desafiar. Si alcanzas el 100%, fueron muy faciles. El 70% es exito.',
        icon: '🚀'
      },
      {
        id: 'okr-3',
        title: 'Resultados Medibles',
        content: 'Sin numeros no hay OKR. "Mejorar ventas" no vale. "Aumentar ventas 25%" si.',
        icon: '📊'
      },
      {
        id: 'okr-4',
        title: 'Transparencia Total',
        content: 'Todos los OKRs son publicos. De arriba abajo. Alineacion clara de prioridades.',
        icon: '👁️'
      },
      {
        id: 'okr-5',
        title: 'Ciclos Trimestrales',
        content: 'OKRs se fijan por trimestre. Revision mensual. Ritmo que mantiene enfoque.',
        icon: '📅'
      },
      {
        id: 'okr-6',
        title: 'Desacoplado de Compensacion',
        content: 'OKRs no son bonos. Separar incentivos financieros preserva la ambicion.',
        icon: '💰'
      },
      {
        id: 'okr-7',
        title: 'De Arriba a Abajo y Viceversa',
        content: '60% de OKRs vienen de abajo. Alineacion no es dictadura. Participacion genera compromiso.',
        icon: '↕️'
      },
      {
        id: 'okr-8',
        title: 'Revision y Aprendizaje',
        content: 'Al final del ciclo, evalua. Que funciono? Que no? Aprende y ajusta el proximo.',
        icon: '🔄'
      }
    ],
    tasks: [
      { id: 'okr-t1', text: 'Define 1 objetivo ambicioso para este trimestre', completed: false },
      { id: 'okr-t2', text: 'Establece 3 resultados clave medibles para tu objetivo', completed: false },
      { id: 'okr-t3', text: 'Comparte tus OKRs con tu equipo', completed: false },
      { id: 'okr-t4', text: 'Programa revisiones semanales de progreso', completed: false },
      { id: 'okr-t5', text: 'Evalua tus OKRs al final del trimestre', completed: false }
    ]
  },
  {
    id: 'proyectos-humanos',
    title: 'Project Management for Humans',
    author: 'Brett Harned',
    category: 'manejo-proyectos',
    cards: [
      {
        id: 'ph-1',
        title: 'Personas Primero',
        content: 'Los proyectos los hacen personas. Gestiona relaciones, no solo tareas. Empatia es clave.',
        icon: '👥'
      },
      {
        id: 'ph-2',
        title: 'Comunicacion Clara',
        content: 'Sobrercomunicar es mejor que subcomunicar. Canales claros, expectativas explicitas.',
        icon: '💬'
      },
      {
        id: 'ph-3',
        title: 'Expectativas Realistas',
        content: 'Promete menos, entrega mas. Gestionar expectativas es mas importante que cumplir plazos.',
        icon: '🎯'
      },
      {
        id: 'ph-4',
        title: 'El Plan es Guia',
        content: 'El plan no es el proyecto. Es un punto de partida. Adapta cuando la realidad cambia.',
        icon: '🗺️'
      },
      {
        id: 'ph-5',
        title: 'Riesgos Identificados',
        content: 'No esperes problemas, anticipalos. Matriz de riesgos: probabilidad x impacto.',
        icon: '⚠️'
      },
      {
        id: 'ph-6',
        title: 'Reuniones Efectivas',
        content: 'Reunion sin agenda es perdida de tiempo. Proposito claro, tiempo definido, acciones al final.',
        icon: '🤝'
      },
      {
        id: 'ph-7',
        title: 'Documentacion Viva',
        content: 'Documentos que nadie lee son inutiles. Manten documentacion relevante y accesible.',
        icon: '📄'
      },
      {
        id: 'ph-8',
        title: 'Cierre de Proyecto',
        content: 'Todo proyecto necesita cierre formal. Lecciones aprendidas, celebracion, transicion.',
        icon: '🏁'
      }
    ],
    tasks: [
      { id: 'ph-t1', text: 'Mapea los stakeholders de tu proyecto actual', completed: false },
      { id: 'ph-t2', text: 'Crea una matriz de riesgos con probabilidad e impacto', completed: false },
      { id: 'ph-t3', text: 'Define expectativas claras con el cliente o sponsor', completed: false },
      { id: 'ph-t4', text: 'Audita tus reuniones: tienen agenda y acciones?', completed: false },
      { id: 'ph-t5', text: 'Documenta 3 lecciones aprendidas de tu ultimo proyecto', completed: false }
    ]
  }
];

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}

export function getBooksByCategory(category: Category): Book[] {
  return books.filter(book => book.category === category);
}
