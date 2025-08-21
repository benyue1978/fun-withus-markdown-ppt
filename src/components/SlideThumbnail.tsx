'use client';

import React from 'react';
import { Slide } from '@/types';
import { cn } from '@/utils/cn';
import { TrashIcon, EditIcon } from '@/components/icons';
import { IconButton } from '@/components/ui/IconButton';

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (index: number) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

export function SlideThumbnail({
  slide,
  index,
  isActive,
  onClick,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  isDragging = false,
  isDragOver = false,
}: SlideThumbnailProps) {
  return (
    <div
      draggable
      className={cn(
        'group relative p-3 border rounded-lg cursor-pointer transition-all',
        'hover:shadow-md hover:border-primary-300',
        isActive
          ? 'bg-primary-50 border-primary-500 shadow-sm'
          : 'bg-white border-gray-200',
        isDragging && 'opacity-50 scale-95',
        isDragOver && 'border-primary-400 bg-primary-25'
      )}
      onClick={onClick}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart?.(index);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd?.();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver?.(index);
      }}
    >
      {/* Slide number */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'text-xs font-medium px-2 py-1 rounded',
            isActive
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600'
          )}
        >
          {index + 1}
        </span>
        
        {/* Action buttons - show on hover or when active */}
        <div
          className={cn(
            'flex space-x-1 opacity-0 transition-opacity',
            'group-hover:opacity-100',
            isActive && 'opacity-100'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="sm"
            onClick={onEdit}
            title="Edit slide"
            className="hover:bg-primary-100"
          >
            <EditIcon className="w-3 h-3" />
          </IconButton>
          <IconButton
            size="sm"
            onClick={onDelete}
            title="Delete slide"
            className="hover:bg-red-100 hover:text-red-600"
          >
            <TrashIcon className="w-3 h-3" />
          </IconButton>
        </div>
      </div>

      {/* Slide title */}
      <h4
        className={cn(
          'text-sm font-medium mb-2 line-clamp-2',
          isActive ? 'text-primary-900' : 'text-gray-900'
        )}
      >
        {slide.title}
      </h4>

      {/* Slide content preview */}
      <div className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
        {slide.content
          .replace(/^#{1,6}\s+/gm, '') // Remove headings
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/`(.*?)`/g, '$1') // Remove inline code
          .replace(/```[\s\S]*?```/g, '[code block]') // Replace code blocks
          .replace(/^\s*[-*+]\s+/gm, '• ') // Convert list items
          .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists
          .trim()
          .substring(0, 100)}
        {slide.content.length > 100 && '...'}
      </div>

      {/* Character count */}
      <div className="mt-2 text-xs text-gray-400">
        {slide.content.length} chars
      </div>
    </div>
  );
}
