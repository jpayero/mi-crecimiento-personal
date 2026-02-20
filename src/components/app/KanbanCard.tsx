'use client';

import { useRef, useCallback } from 'react';
import { KanbanCard as KanbanCardType, Category } from '@/data/books';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Sparkles, Zap, Target, Heart } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ColorStyle {
  bg: string;
  border: string;
  accent: string;
  glow: string;
  pattern?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

interface KanbanCardProps {
  card: KanbanCardType & { colorStyle?: ColorStyle };
  category: Category;
  index?: number;
}

// 4 unique and attractive card designs
const cardDesigns: { 
  bg: string; 
  border: string; 
  accent: string; 
  glow: string; 
  pattern: string; 
  icon: React.ReactNode;
  gradient: string;
}[] = [
  // Design 1: Golden Energy - Focus & Clarity
  {
    bg: 'from-amber-500/30 via-orange-400/25 to-yellow-500/30',
    border: 'border-amber-400/70',
    accent: 'text-amber-100',
    glow: 'shadow-[0_0_40px_rgba(251,191,36,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]',
    pattern: 'bg-[conic-gradient(from_45deg_at_50%_50%,rgba(251,191,36,0.12)_0deg,transparent_90deg,rgba(251,191,36,0.08)_180deg,transparent_270deg)]',
    icon: <Sparkles className="absolute top-3 right-3 h-5 w-5 text-amber-400/50" />,
    gradient: 'from-amber-400 to-orange-500'
  },
  // Design 2: Emerald Growth - Habits & Progress
  {
    bg: 'from-emerald-500/30 via-teal-400/25 to-cyan-500/30',
    border: 'border-emerald-400/70',
    accent: 'text-emerald-100',
    glow: 'shadow-[0_0_40px_rgba(16,185,129,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]',
    pattern: 'bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.15)_0%,transparent_70%)]',
    icon: <Zap className="absolute top-3 right-3 h-5 w-5 text-emerald-400/50" />,
    gradient: 'from-emerald-400 to-teal-500'
  },
  // Design 3: Violet Wisdom - Mindset & Knowledge
  {
    bg: 'from-violet-500/30 via-purple-400/25 to-fuchsia-500/30',
    border: 'border-violet-400/70',
    accent: 'text-violet-100',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]',
    pattern: 'bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15)_0%,transparent_50%)]',
    icon: <Target className="absolute top-3 right-3 h-5 w-5 text-violet-400/50" />,
    gradient: 'from-violet-400 to-purple-500'
  },
  // Design 4: Rose Passion - Motivation & Action
  {
    bg: 'from-rose-500/30 via-pink-400/25 to-red-500/30',
    border: 'border-rose-400/70',
    accent: 'text-rose-100',
    glow: 'shadow-[0_0_40px_rgba(244,63,94,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]',
    pattern: 'bg-[linear-gradient(135deg,rgba(244,63,94,0.12)_0%,transparent_50%,rgba(244,63,94,0.08)_100%)]',
    icon: <Heart className="absolute top-3 right-3 h-5 w-5 text-rose-400/50" />,
    gradient: 'from-rose-400 to-pink-500'
  }
];

function getCardDesign(index: number): ColorStyle {
  return cardDesigns[index % 4];
}

export function KanbanCard({ card, category, index = 0 }: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use provided colorStyle or get design based on index
  const colorStyle = card.colorStyle || getCardDesign(index);

  const handleExportAsImage = useCallback(async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#0f172a',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = `${card.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error exporting card:', error);
      }
    }
  }, [card.title]);

  return (
    <div ref={cardRef} className="relative group h-full">
      <div 
        className={`
          bg-gradient-to-br ${colorStyle.bg}
          border-2 ${colorStyle.border}
          backdrop-blur-xl
          hover:scale-[1.02] 
          transition-all 
          duration-300 
          rounded-xl
          shadow-xl hover:shadow-2xl ${colorStyle.glow}
          min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]
          overflow-hidden
          flex flex-col
          relative
        `}
      >
        {/* Pattern overlay */}
        {colorStyle.pattern && (
          <div className={`absolute inset-0 ${colorStyle.pattern} pointer-events-none`} />
        )}
        
        {/* Top gradient bar */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorStyle.gradient}`} />
        
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${colorStyle.gradient}`} />
        
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/8 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
        
        {/* Animated shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
        
        {/* Design icon */}
        {colorStyle.icon}
        
        {/* Card number badge */}
        <div className={`absolute top-3 left-3 text-[10px] font-mono ${colorStyle.accent} opacity-60 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm`}>
          #{(index + 1).toString().padStart(2, '0')}
        </div>
        
        {/* Content */}
        <div className="p-5 pt-10 flex-1 flex flex-col relative z-10">
          {/* Icon and Title */}
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl sm:text-4xl drop-shadow-lg flex-shrink-0 transform hover:scale-110 transition-transform cursor-default">
              {card.icon}
            </span>
            <h3 className={`${colorStyle.accent} text-base sm:text-lg font-bold leading-tight drop-shadow-sm`}>
              {card.title}
            </h3>
          </div>
          
          {/* Content text */}
          <p className="text-gray-100/90 text-sm sm:text-base leading-relaxed flex-1">
            {card.content}
          </p>
        </div>

        {/* Export button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExportAsImage}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 text-white h-8 px-3 text-xs backdrop-blur-sm z-20"
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          PNG
        </Button>
      </div>
    </div>
  );
}

interface KanbanGridProps {
  cards: (KanbanCardType & { colorStyle?: ColorStyle })[];
  category: Category;
  currentIndex: number;
}

export function KanbanGrid({ 
  cards, 
  category, 
  currentIndex
}: KanbanGridProps) {
  const visibleCards = cards.slice(currentIndex, currentIndex + 4);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleExportAll = useCallback(async () => {
    if (gridRef.current) {
      try {
        const canvas = await html2canvas(gridRef.current, {
          backgroundColor: '#0f172a',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = 'kanban-cards.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error exporting cards:', error);
      }
    }
  }, []);

  return (
    <div 
      ref={gridRef} 
      className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 p-3 sm:p-4 h-full auto-rows-fr"
    >
      {/* Cards */}
      {visibleCards.map((card, index) => (
        <KanbanCard
          key={card.id}
          card={card}
          category={category}
          index={currentIndex + index}
        />
      ))}

      {/* Empty slots for visual consistency */}
      {visibleCards.length < 4 &&
        Array.from({ length: 4 - visibleCards.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="hidden sm:flex border-2 border-dashed border-slate-700/30 rounded-xl min-h-[180px] items-center justify-center bg-slate-800/5"
          >
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Proxima tarjeta</p>
            </div>
          </div>
        ))}
    </div>
  );
}
