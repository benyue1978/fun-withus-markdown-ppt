'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/utils/cn';
import { downloadAsFile } from '@/utils/storage';
import { slidesToMarkdown } from '@/utils/markdownParser';

interface SlideEditorProps {
  className?: string;
}

export function SlideEditor({ className }: SlideEditorProps) {
  const { state, dispatch } = useApp();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const currentSlide = state.presentation?.slides[state.currentSlideIndex];

  const createNewSlide = useCallback((value: string) => {
    console.log('Creating new slide...');
    let contentWithoutSeparator = value.trim();
    if (contentWithoutSeparator.endsWith('---')) {
      contentWithoutSeparator = contentWithoutSeparator.slice(0, -3).trim();
    }
    
    dispatch({
      type: 'UPDATE_SLIDE',
      payload: {
        index: state.currentSlideIndex,
        content: contentWithoutSeparator,
      },
    });
    
    setTimeout(() => {
      console.log('Adding new slide after index:', state.currentSlideIndex);
      dispatch({
        type: 'ADD_SLIDE',
        payload: { index: state.currentSlideIndex + 1 },
      });
    }, 100);
  }, [dispatch, state.currentSlideIndex]);

  const updateMultipleSlides = useCallback((value: string) => {
    console.log('Multiple slides detected, updating full content...');
    const allSlides = state.presentation?.slides || [];
    const fullContent = allSlides.map((slide, index) => {
      if (index === state.currentSlideIndex) {
        return value;
      }
      return slide.content;
    }).join('\n\n---\n\n');
    
    dispatch({ type: 'UPDATE_CONTENT', payload: fullContent });
  }, [dispatch, state.currentSlideIndex, state.presentation?.slides]);

  const updateSingleSlide = useCallback((value: string) => {
    console.log('Updating single slide content...');
    dispatch({
      type: 'UPDATE_SLIDE',
      payload: {
        index: state.currentSlideIndex,
        content: value,
      },
    });
  }, [dispatch, state.currentSlideIndex]);

  const checkSeparatorEnd = useCallback((value: string) => {
    return value.endsWith('---') || value.endsWith('---\n') || value.endsWith('---\r\n');
  }, []);

  const handleContentChange = useCallback((value: string) => {
    console.log('handleContentChange called with:', { value: value.substring(0, 100) + '...', length: value.length });
    
    const endsWithSeparator = checkSeparatorEnd(value);
    console.log('Ends with separator:', endsWithSeparator);
    
    if (endsWithSeparator) {
      createNewSlide(value);
      return;
    }
    
    const separatorCount = (value.match(/^---\s*$/gm) || []).length;
    console.log('Separator count:', separatorCount);
    
    if (separatorCount > 0) {
      updateMultipleSlides(value);
    } else if (state.currentSlideIndex !== undefined) {
      updateSingleSlide(value);
    }
  }, [checkSeparatorEnd, createNewSlide, updateMultipleSlides, updateSingleSlide, state.currentSlideIndex]);

  const removeIndentation = useCallback((textarea: HTMLTextAreaElement, start: number, value: string) => {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
    
    if (currentLine.startsWith('  ')) {
      const newValue = value.substring(0, lineStart) + currentLine.substring(2) + value.substring(lineEnd === -1 ? value.length : lineEnd);
      handleContentChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start - 2;
      }, 0);
    }
  }, [handleContentChange]);

  const addIndentation = useCallback((textarea: HTMLTextAreaElement, start: number, end: number, value: string) => {
    const newValue = value.substring(0, start) + '  ' + value.substring(end);
    handleContentChange(newValue);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }, 0);
  }, [handleContentChange]);

  const handleTabIndentation = useCallback((textarea: HTMLTextAreaElement, shiftKey: boolean) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    if (shiftKey) {
      removeIndentation(textarea, start, value);
    } else {
      addIndentation(textarea, start, end, value);
    }
  }, [removeIndentation, addIndentation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabIndentation(e.currentTarget as HTMLTextAreaElement, e.shiftKey);
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      // Save as Markdown file
      if (state.presentation) {
        const markdownContent = slidesToMarkdown(state.presentation.slides);
        const filename = `${state.presentation.title || 'presentation'}.md`;
        downloadAsFile(markdownContent, filename, 'text/markdown');
      }
    }
  }, [handleTabIndentation, state.presentation]);

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
          <div>• Press Ctrl+S (or Cmd+S) to save as Markdown file</div>
        </div>
      </div>
    </div>
  );
}
