'use client';

import { useEffect } from 'react';
import { Book, Task } from '@/data/books';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { useTaskProgress, useGrowth } from '@/hooks/useLocalStorage';

interface TaskListProps {
  book: Book;
}

export function TaskList({ book }: TaskListProps) {
  const { getTaskProgress, toggleTask, setTasksForBook } = useTaskProgress(book.id);
  const { markBookAsStudied } = useGrowth();
  
  const savedTasks = getTaskProgress();
  const tasks = book.tasks.map(task => {
    const saved = savedTasks.find(t => t.id === task.id);
    return saved ? { ...task, completed: saved.completed } : task;
  });

  useEffect(() => {
    // Initialize tasks if not already saved
    if (savedTasks.length === 0 && book.tasks.length > 0) {
      setTasksForBook(book.tasks.map(t => ({ id: t.id, completed: false })));
    }
  }, [book.id, book.tasks, savedTasks.length, setTasksForBook]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleToggle = (taskId: string) => {
    toggleTask(taskId);
    markBookAsStudied(book.id);
  };

  return (
    <Card className="bg-slate-900/80 border-slate-700 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-emerald-400" />
          Tareas Accionables
        </CardTitle>
        
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-400">Progreso</span>
            <span className="text-emerald-400 font-medium">
              {completedCount}/{tasks.length} completadas
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-2">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`
                  flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer
                  ${task.completed 
                    ? 'bg-emerald-900/20 border border-emerald-500/30' 
                    : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'}
                `}
                onClick={() => handleToggle(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                )}
                <span 
                  className={`
                    text-sm leading-relaxed
                    ${task.completed ? 'text-slate-400 line-through' : 'text-white'}
                  `}
                >
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
