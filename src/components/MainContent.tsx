'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { SlidePreview } from './SlidePreview';
import { SlideEditor } from './SlideEditor';
import { SlideNavigation } from './SlideNavigation';
import { cn } from '@/utils/cn';

interface MainContentProps {
  className?: string;
}

export function MainContent({ className }: MainContentProps) {
  const { state } = useApp();
  
  const { presentation, currentSlideIndex, isEditing } = state;
  const currentSlide = presentation?.slides[currentSlideIndex];

  if (!presentation || !currentSlide) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No presentation loaded</h3>
          <p className="text-gray-600">Create a new presentation to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          // Split view: Editor + Preview
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Editor */}
            <div className="border-r border-gray-200 overflow-hidden">
              <SlideEditor />
            </div>
            
            {/* Preview */}
            <div className="hidden lg:block overflow-hidden p-4">
              <SlidePreview 
                slide={currentSlide} 
                isActive={true}
                className="h-full"
              />
            </div>
          </div>
        ) : (
          // Full preview
          <div className="h-full p-4">
            <SlidePreview 
              slide={currentSlide} 
              isActive={true}
              className="h-full mx-auto max-w-4xl"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <SlideNavigation />
    </div>
  );
}
