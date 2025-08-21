'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/utils/cn';

interface SlideEditorProps {
  className?: string;
}

export function SlideEditor({ className }: SlideEditorProps) {
  const { state, dispatch } = useApp();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const currentSlide = state.presentation?.slides[state.currentSlideIndex];

  const handleContentChange = useCallback((value: string) => {
    if (state.currentSlideIndex !== undefined) {
      dispatch({
        type: 'UPDATE_SLIDE',
        payload: {
          index: state.currentSlideIndex,
          content: value,
        },
      });
    }
  }, [dispatch, state.currentSlideIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      if (e.shiftKey) {
        // Remove indentation
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
        
        if (currentLine.startsWith('  ')) {
          const newValue = value.substring(0, lineStart) + currentLine.substring(2) + value.substring(lineEnd === -1 ? value.length : lineEnd);
          handleContentChange(newValue);
          
          // Restore cursor position
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - 2;
          }, 0);
        }
      } else {
        // Add indentation
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        handleContentChange(newValue);
        
        // Restore cursor position
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
    
    // Save shortcut
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        // Auto-save is already handled by the context
      }
    }
  }, [handleContentChange]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [currentSlide?.content]);

  if (!currentSlide) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p className="text-gray-500">No slide selected</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="font-medium text-gray-900">
          Edit Slide {state.currentSlideIndex + 1}
        </h3>
        <div className="text-sm text-gray-500">
          {currentSlide.content.length} characters
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={currentSlide.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full h-full min-h-[400px] p-4 border rounded-md',
            'font-mono text-sm leading-relaxed',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'placeholder-gray-400 resize-none'
          )}
          placeholder="Enter your markdown content here...

Use --- to separate slides
Support for:
# Headings
- Lists
**Bold** and *italic*
`code` and code blocks
> Blockquotes
And much more!"
        />
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-500">
          <div>Tips:</div>
          <div>• Press Tab to indent, Shift+Tab to unindent</div>
          <div>• Use --- to create new slides</div>
          <div>• Changes are saved automatically</div>
        </div>
      </div>
    </div>
  );
}
