'use client';

import { useRef } from 'react';
import { Book, KanbanCard as KanbanCardType, categoryConfig } from '@/data/books';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Image as ImageIcon, FileText, Presentation, ChevronDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPanelProps {
  book: Book | null;
  visibleCards: KanbanCardType[];
  gridRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportPanel({ book, visibleCards, gridRef }: ExportPanelProps) {
  // Export single card as image
  const exportCardAsImage = async (card: KanbanCardType) => {
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLElement;
    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement, {
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
  };

  // Export all visible cards as one image
  const exportVisibleAsImage = async () => {
    if (gridRef.current) {
      try {
        const canvas = await html2canvas(gridRef.current, {
          backgroundColor: '#0f172a',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = `kanban-${book?.title.replace(/\s+/g, '-').toLowerCase() || 'cards'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error exporting cards:', error);
      }
    }
  };

  // Export all cards as PDF
  const exportAsPDF = async () => {
    if (!book) return;

    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Title page
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.text(book.title, pageWidth / 2, pageHeight / 2 - 10, { align: 'center' });
      pdf.setFontSize(16);
      pdf.setTextColor(156, 163, 175);
      pdf.text(book.author, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });

      // Add cards
      for (let i = 0; i < book.cards.length; i++) {
        pdf.addPage();
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        const card = book.cards[i];
        
        // Card background
        pdf.setFillColor(30, 41, 59);
        pdf.roundedRect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 5, 5, 'F');

        // Title
        pdf.setFontSize(20);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${card.icon} ${card.title}`, pageWidth / 2, margin + 20, { align: 'center' });

        // Content
        pdf.setFontSize(14);
        pdf.setTextColor(229, 231, 235);
        const lines = pdf.splitTextToSize(card.content, pageWidth - margin * 4);
        pdf.text(lines, pageWidth / 2, margin + 50, { align: 'center' });

        // Page number
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`${i + 1}/${book.cards.length}`, pageWidth / 2, pageHeight - margin, { align: 'center' });
      }

      pdf.save(`${book.title.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  // Export as PowerPoint (actually a PDF with multiple slides)
  const exportAsPPT = async () => {
    if (!book) return;
    await exportAsPDF();
  };

  // Export all cards individually
  const exportAllCardsAsImages = async () => {
    if (!book) return;
    
    for (const card of book.cards) {
      await exportCardAsImage(card);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  if (!book) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Exportar
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
        <DropdownMenuItem 
          onClick={exportVisibleAsImage}
          className="cursor-pointer hover:bg-slate-700"
        >
          <ImageIcon className="h-4 w-4 mr-2 text-blue-400" />
          Descargar visibles como imagen
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAllCardsAsImages}
          className="cursor-pointer hover:bg-slate-700"
        >
          <ImageIcon className="h-4 w-4 mr-2 text-green-400" />
          Descargar todas como imagenes
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsPDF}
          className="cursor-pointer hover:bg-slate-700"
        >
          <FileText className="h-4 w-4 mr-2 text-red-400" />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsPPT}
          className="cursor-pointer hover:bg-slate-700"
        >
          <Presentation className="h-4 w-4 mr-2 text-orange-400" />
          Exportar como presentacion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
