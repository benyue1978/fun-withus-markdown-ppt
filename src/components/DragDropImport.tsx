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
  }, [dispatch]);

  const handleFilePath = useCallback(async (filePath: string) => {
    console.log('Attempting to read file from path:', filePath);
    
    try {
      // Try to use File System Access API if available
      if ('showOpenFilePicker' in window) {
        console.log('File System Access API available, prompting user to select file');
        // We can't directly access the file due to security restrictions,
        // but we can show a file picker dialog
        return false;
      } else {
        console.log('File System Access API not available');
        return false;
      }
    } catch (error) {
      console.error('Error handling file path:', error);
      return false;
    }
  }, []);

  const handleCursorDrop = useCallback(async (dataTransfer: DataTransfer) => {
    console.log('Handling Cursor-specific drop data');
    
    // Try to extract file path from various Cursor-specific types
    const possiblePaths = [];
    
    // Check text/plain for file path
    const plainText = dataTransfer.getData('text/plain');
    if (plainText && plainText.startsWith('/')) {
      possiblePaths.push(plainText);
    }
    
    // Check codefiles for JSON array of paths
    try {
      const codefiles = dataTransfer.getData('codefiles');
      if (codefiles) {
        const paths = JSON.parse(codefiles);
        if (Array.isArray(paths)) {
          possiblePaths.push(...paths);
        }
      }
    } catch (e) {
      console.log('Could not parse codefiles data');
    }
    
    // Check resourceurls for file URLs
    try {
      const resourceurls = dataTransfer.getData('resourceurls');
      if (resourceurls) {
        const urls = JSON.parse(resourceurls);
        if (Array.isArray(urls)) {
          urls.forEach(url => {
            if (url.startsWith('file://')) {
              const path = url.replace('file://', '');
              possiblePaths.push(path);
            }
          });
        }
      }
    } catch (e) {
      console.log('Could not parse resourceurls data');
    }
    
    console.log('Extracted possible file paths:', possiblePaths);
    
    if (possiblePaths.length > 0) {
      // For now, we'll show a message to the user about the file path
      // and suggest they use the file picker instead
      const filePath = possiblePaths[0];
      const fileName = filePath.split('/').pop() || 'Unknown file';
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      
      let message = `File detected: ${fileName}\n\n`;
      
      // Check if the file type is supported
      if (fileExtension === 'json') {
        message += `⚠️  JSON files are not supported.\n\n`;
        message += `This tool is designed for Markdown content. Please use:\n`;
        message += `• Markdown files (.md, .markdown)\n`;
        message += `• Plain text files (.txt)\n`;
        message += `• Any text-based file\n\n`;
      } else if (fileExtension === 'md' || fileExtension === 'markdown' || fileExtension === 'txt') {
        message += `✅  File format is supported!\n\n`;
        message += `Due to browser security restrictions, we cannot directly read files from your file system.\n\n`;
        message += `Please use the "Import" button to select your file manually.`;
      } else {
        message += `❓  File format may not be supported.\n\n`;
        message += `Supported formats:\n`;
        message += `• Markdown (.md, .markdown)\n`;
        message += `• Plain text (.txt)\n`;
        message += `• Any text-based file\n\n`;
        message += `Please use the "Import" button to select a supported file.`;
      }
      
      alert(message);
      
      return true;
    }
    
    return false;
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=== Drag Enter ===');
    console.log('DataTransfer types:', e.dataTransfer.types);
    console.log('DataTransfer items:', e.dataTransfer.items.length);
    console.log('DataTransfer files:', e.dataTransfer.files.length);
    
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=== Drag Leave ===');
    
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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    console.log('=== Drop event triggered ===');
    console.log('DataTransfer types:', e.dataTransfer.types);
    console.log('DataTransfer items:', e.dataTransfer.items);
    console.log('DataTransfer files:', e.dataTransfer.files);
    
    // Log all dataTransfer properties for debugging
    if (e.dataTransfer.types) {
      e.dataTransfer.types.forEach(type => {
        console.log(`Type: ${type}, Data:`, e.dataTransfer.getData(type));
      });
    }
    
    // Check for files
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files.map(f => ({ 
      name: f.name, 
      type: f.type, 
      size: f.size,
      lastModified: f.lastModified 
    })));
    
    // Check for items (might contain file paths)
    const items = Array.from(e.dataTransfer.items);
    console.log('Items dropped:', items.map(item => ({
      kind: item.kind,
      type: item.type
    })));
    
    if (files.length > 0) {
      console.log('Processing file:', files[0].name);
      const success = handleFileRead(files[0]);
      if (success) {
        console.log('File processed successfully');
      } else {
        console.log('File processing failed');
      }
    } else if (items.length > 0) {
      console.log('No files but items found, trying to get files from items...');
      let fileFound = false;
      
      items.forEach((item, index) => {
        if (item.kind === 'file') {
          try {
            const file = item.getAsFile();
            if (file) {
              console.log(`Found file from item ${index}:`, file.name);
              fileFound = true;
              handleFileRead(file);
            } else {
              console.log(`Item ${index} is file but getAsFile() returned null`);
            }
          } catch (error) {
            console.log(`Error getting file from item ${index}:`, error);
          }
        } else {
          console.log(`Item ${index} is not a file (kind: ${item.kind})`);
        }
      });
      
      if (!fileFound) {
        console.log('No files could be extracted from items');
        // Try to handle Cursor-specific drop data
        const cursorHandled = await handleCursorDrop(e.dataTransfer);
        if (cursorHandled) {
          console.log('Cursor drop data handled successfully');
        } else {
          console.log('Cursor drop data could not be handled');
        }
      }
    } else {
      console.log('No files or items found in drop event');
      console.log('This might indicate a drag source issue (e.g., from Cursor file explorer)');
      // Try to handle Cursor-specific drop data as fallback
      const cursorHandled = await handleCursorDrop(e.dataTransfer);
      if (cursorHandled) {
        console.log('Cursor drop data handled successfully');
      } else {
        console.log('Cursor drop data could not be handled');
      }
    }
  }, [handleFileRead, handleCursorDrop]);

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
            <div className="text-sm opacity-90 mb-3">Release to import your file</div>
            <div className="text-xs opacity-75 bg-white bg-opacity-20 rounded-lg p-3 max-w-xs">
              <div className="font-medium mb-1">Supported formats:</div>
              <div>• Markdown (.md, .markdown)</div>
              <div>• Plain text (.txt)</div>
              <div>• Any text-based file</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
