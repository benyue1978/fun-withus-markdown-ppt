'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { SlideThumbnail } from './SlideThumbnail';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { PlusIcon, MenuIcon, XIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { state, dispatch } = useApp();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const { presentation, currentSlideIndex, sidebarCollapsed } = state;

  const handleSlideClick = (index: number) => {
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: index });
  };

  const handleEditSlide = (index: number) => {
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: index });
    dispatch({ type: 'SET_EDITING', payload: true });
  };

  const handleDeleteSlide = (index: number) => {
    if (presentation && presentation.slides.length > 1) {
      dispatch({ type: 'DELETE_SLIDE', payload: index });
    }
  };

  const handleAddSlide = () => {
    dispatch({ 
      type: 'ADD_SLIDE', 
      payload: { index: currentSlideIndex + 1 }
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      dispatch({
        type: 'REORDER_SLIDES',
        payload: {
          fromIndex: draggedIndex,
          toIndex: dragOverIndex,
        },
      });
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (index: number) => {
    setDragOverIndex(index);
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  if (!presentation) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 lg:z-0',
          'w-80 bg-white border-r border-gray-200',
          'transform transition-transform duration-300 ease-in-out',
          'lg:transform-none flex flex-col h-full',
          sidebarCollapsed ? '-translate-x-full lg:w-0 lg:overflow-hidden' : 'translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
          <h2 className="font-semibold text-gray-900">Slides</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddSlide}
              className="flex items-center space-x-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
            <IconButton
              onClick={toggleSidebar}
              className="lg:hidden"
              title="Close sidebar"
            >
              <XIcon className="w-5 h-5" />
            </IconButton>
          </div>
        </div>

        {/* Slide list */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="space-y-3">
            {presentation.slides.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                slide={slide}
                index={index}
                isActive={index === currentSlideIndex}
                onClick={() => handleSlideClick(index)}
                onEdit={() => handleEditSlide(index)}
                onDelete={() => handleDeleteSlide(index)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                isDragging={draggedIndex === index}
                isDragOver={dragOverIndex === index}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total slides:</span>
              <span className="font-medium">{presentation.slides.length}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Current:</span>
              <span className="font-medium">{currentSlideIndex + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar toggle button (when collapsed) */}
      {sidebarCollapsed && (
        <IconButton
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 lg:relative lg:top-0 lg:left-0 bg-white shadow-lg lg:shadow-none"
          title="Open sidebar"
        >
          <MenuIcon className="w-5 h-5" />
        </IconButton>
      )}
    </>
  );
}
