'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface InsertLineProps {
  className?: string;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function InsertLine({ className, onDragOver, onDrop }: InsertLineProps) {
  return (
    <div 
      className={cn('flex items-center my-1 relative', className)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver?.(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop?.(e);
      }}
    >
      {/* Extended hit area for better drop targeting */}
      <div className="absolute inset-0 -inset-y-2" />
      
      <div className="flex-1 h-0.5 bg-primary-500 rounded-full shadow-sm" />
      <div className="mx-2 w-3 h-3 bg-primary-500 rounded-full border-2 border-white shadow-sm" />
      <div className="flex-1 h-0.5 bg-primary-500 rounded-full shadow-sm" />
    </div>
  );
}
