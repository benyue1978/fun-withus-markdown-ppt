'use client';

import React, { useCallback, useState, ReactNode } from 'react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/utils/cn';

interface DragDropImportProps {
  children: ReactNode;
  className?: string;
}

export function DragDropImport({ children, className }: DragDropImportProps) {
  const { dispatch } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleFileRead = useCallback((file: File) => {
    console.log('Reading file:', file.name, 'type:', file.type);
    // Accept any text file or .md files
    if (file && (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.markdown'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File content loaded:', content?.substring(0, 100));
        if (content) {
          dispatch({ type: 'UPDATE_CONTENT', payload: content });
        }
      };
      reader.onerror = (e) => {
        console.error('File read error:', e);
      };
      reader.readAsText(file);
      return true;
    }
    console.log('File type not supported');
    return false;
  }, [dispatch]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    console.log('Drop event triggered');
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files.map(f => ({ name: f.name, type: f.type })));
    
    if (files.length > 0) {
      // Just try to read the first file regardless of type
      const file = files[0];
      handleFileRead(file);
    } else {
      console.log('No files in drop event');
    }
  }, [handleFileRead]);

  return (
    <div
      className={cn(
        'relative',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary-500 bg-opacity-90 z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-xl font-semibold mb-2">Drop Markdown File</div>
            <div className="text-sm opacity-90">Release to import your .md file</div>
          </div>
        </div>
      )}
    </div>
  );
}
