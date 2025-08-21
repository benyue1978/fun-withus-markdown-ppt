'use client';

import React, { useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

interface SlideNavigationProps {
  className?: string;
}

export function SlideNavigation({ className }: SlideNavigationProps) {
  const { state, dispatch } = useApp();
  
  const { presentation, currentSlideIndex } = state;
  const totalSlides = presentation?.slides.length || 0;
  
  const goToPrevious = useCallback(() => {
    if (currentSlideIndex > 0) {
      dispatch({ type: 'SET_CURRENT_SLIDE', payload: currentSlideIndex - 1 });
    }
  }, [currentSlideIndex, dispatch]);
  
  const goToNext = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      dispatch({ type: 'SET_CURRENT_SLIDE', payload: currentSlideIndex + 1 });
    }
  }, [currentSlideIndex, totalSlides, dispatch]);
  
  const addSlide = () => {
    dispatch({
      type: 'ADD_SLIDE',
      payload: { index: currentSlideIndex + 1 },
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as Element)?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Space bar
          e.preventDefault();
          goToNext();
          break;
        case 'Home':
          e.preventDefault();
          dispatch({ type: 'SET_CURRENT_SLIDE', payload: 0 });
          break;
        case 'End':
          e.preventDefault();
          dispatch({ type: 'SET_CURRENT_SLIDE', payload: totalSlides - 1 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, totalSlides, dispatch, goToNext, goToPrevious]);

  if (!presentation) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-between p-4 bg-white border-t', className)}>
      {/* Previous button */}
      <IconButton
        onClick={goToPrevious}
        disabled={currentSlideIndex === 0}
        title="Previous slide (Arrow Left)"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </IconButton>

      {/* Slide indicator and controls */}
      <div className="flex items-center space-x-4">
        {/* Slide counter */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">{currentSlideIndex + 1}</span>
          <span className="mx-1">/</span>
          <span>{totalSlides}</span>
        </div>

        {/* Add slide button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={addSlide}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Slide</span>
        </Button>

        {/* Slide progress bar */}
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{
              width: `${((currentSlideIndex + 1) / totalSlides) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Next button */}
      <IconButton
        onClick={goToNext}
        disabled={currentSlideIndex === totalSlides - 1}
        title="Next slide (Arrow Right)"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </IconButton>
    </div>
  );
}
