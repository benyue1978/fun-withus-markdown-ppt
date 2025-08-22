'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { DocumentIcon, XIcon, UploadIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { dispatch } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = useCallback((file: File) => {
    console.log('Reading file:', file.name, 'type:', file.type);
    
    // Check if file is supported
    const isTextFile = file.type.startsWith('text/');
    const isMarkdownFile = file.name.endsWith('.md') || file.name.endsWith('.markdown');
    const isJsonFile = file.name.endsWith('.json');
    const isSupported = isTextFile || isMarkdownFile;
    
    if (file && isSupported) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File content loaded:', content?.substring(0, 100));
        if (content) {
          dispatch({ type: 'UPDATE_CONTENT', payload: content });
          onClose(); // Close modal after successful import
        }
      };
      reader.onerror = (e) => {
        console.error('File read error:', e);
        alert(`Error reading file "${file.name}": ${e.target?.error?.message || 'Unknown error'}`);
      };
      reader.readAsText(file);
      return true;
    } else {
      // Show user-friendly error message for unsupported files
      let message = `File "${file.name}" is not supported.\n\n`;
      
      if (isJsonFile) {
        message += `JSON files are not supported. This tool is designed for Markdown content.\n\n`;
        message += `Please use a Markdown (.md) file or a plain text file instead.`;
      } else if (file.type) {
        message += `File type "${file.type}" is not supported.\n\n`;
        message += `Supported formats:\n`;
        message += `• Markdown files (.md, .markdown)\n`;
        message += `• Plain text files (.txt)\n`;
        message += `• Any text-based file`;
      } else {
        message += `This file format is not supported.\n\n`;
        message += `Supported formats:\n`;
        message += `• Markdown files (.md, .markdown)\n`;
        message += `• Plain text files (.txt)\n`;
        message += `• Any text-based file`;
      }
      
      alert(message);
      console.log('File type not supported:', file.name, file.type);
      return false;
    }
  }, [dispatch, onClose]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileRead]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileRead(files[0]);
    }
  }, [handleFileRead]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <DocumentIcon className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Import Markdown</h2>
          </div>
          <IconButton
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <XIcon className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt,text/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Drag and drop area */}
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              isDragOver
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragOver ? 'Drop your file here' : 'Drag and drop your file'}
            </h3>
            <p className="text-gray-600 mb-4">
              or click the button below to browse
            </p>
            <Button
              variant="primary"
              onClick={handleButtonClick}
              className="flex items-center space-x-2"
            >
              <DocumentIcon className="w-4 h-4" />
              <span>Choose File</span>
            </Button>
          </div>

          {/* Supported formats info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Supported formats:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Markdown files (.md, .markdown)</li>
              <li>• Plain text files (.txt)</li>
              <li>• Any text-based file</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
