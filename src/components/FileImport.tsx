'use client';

import React, { useCallback, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { DocumentIcon } from '@/components/icons';

interface FileImportProps {
  className?: string;
}

export function FileImport({ className }: FileImportProps) {
  const { dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type === 'text/markdown' || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          dispatch({ type: 'UPDATE_CONTENT', payload: content });
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid Markdown (.md) file');
    }
  }, [dispatch]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,text/markdown"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <Button
        variant="secondary"
        onClick={handleButtonClick}
        className="flex items-center space-x-2"
      >
        <DocumentIcon className="w-4 h-4" />
        <span>Import MD</span>
      </Button>
    </div>
  );
}
