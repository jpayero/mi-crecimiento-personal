'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGrowth } from '@/hooks/useLocalStorage';
import { books } from '@/data/books';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Flame, 
  TrendingUp,
  Target
} from 'lucide-react';
import Image from 'next/image';

export function GrowthDashboard() {
  const { 
    booksStudied, 
    streak, 
    getTotalHours, 
    getWeeklyHours,
    getTaskStats,
    studyHours 
  } = useGrowth();

  const totalHours = getTotalHours();
  const weeklyHours = getWeeklyHours();
  const taskStats = getTaskStats();

  // Prepare weekly data for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayData = studyHours.find(h => h.date === dateStr);
    return {
      day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      horas: dayData ? (dayData.minutes / 60).toFixed(1) : 0,
    };
  });

  // Category progress
  const categoryProgress = books.reduce((acc, book) => {
    const key = book.category;
    if (!acc[key]) {
      acc[key] = { total: 0, studied: 0 };
    }
    acc[key].total++;
    if (booksStudied.includes(book.id)) {
      acc[key].studied++;
    }
    return acc;
  }, {} as Record<string, { total: number; studied: number }>);

  const stats = [
    {
      title: 'Libros Estudiados',
      value: booksStudied.length,
      total: books.length,
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Tareas Completadas',
      value: taskStats.completed,
      total: taskStats.total || 1,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
    },
    {
      title: 'Horas de Estudio',
      value: totalHours.toFixed(1),
      total: 100,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Racha de Dias',
      value: streak.current,
      total: 30,
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Tu Crecimiento Personal
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Body Image */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/80 border-slate-700 h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="relative w-64 h-96 animate-pulse-slow">
                  <Image
                    src="/growth-body.png"
                    alt="Cuerpo luminoso de crecimiento"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                <p className="text-center text-slate-400 mt-4 text-sm">
                  Cada dia que estudias, tu luz interior brilla mas fuerte
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Stats */}
          <div className="lg:col-span-1 space-y-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const progress = typeof stat.value === 'number' 
                ? (stat.value / stat.total) * 100 
                : parseFloat(stat.value as string) / stat.total * 100;

              return (
                <Card key={stat.title} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-400 text-sm">{stat.title}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                          {stat.title === 'Horas de Estudio' && 'h'}
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className="h-2 bg-slate-700 mt-3"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Horas de Estudio (7 dias)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7Days}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="horas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Progreso por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryProgress).map(([category, data]) => {
                    const progress = (data.studied / data.total) * 100;
                    const colors: Record<string, string> = {
                      'riqueza': 'bg-amber-500',
                      'desarrollo-personal': 'bg-emerald-500',
                      'psicologia-negocios': 'bg-indigo-500',
                      'emprendimiento': 'bg-orange-500',
                      'historias-exito': 'bg-purple-500',
                      'coaching': 'bg-pink-500',
                      'gerencia': 'bg-cyan-500',
                      'manejo-proyectos': 'bg-lime-500',
                    };
                    const names: Record<string, string> = {
                      'riqueza': 'Riqueza',
                      'desarrollo-personal': 'Desarrollo',
                      'psicologia-negocios': 'Psicologia',
                      'emprendimiento': 'Emprendimiento',
                      'historias-exito': 'Historias',
                      'coaching': 'Coaching',
                      'gerencia': 'Gerencia',
                      'manejo-proyectos': 'Proyectos',
                    };

                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{names[category]}</span>
                          <span className="text-slate-400">{data.studied}/{data.total}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[category]} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
