'use client';

import React, { useState } from 'react';
import { Presentation } from '@/types';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { slidesToMarkdown } from '@/utils/markdownParser';
import { downloadAsFile, copyToClipboard } from '@/utils/storage';
import { XIcon, DownloadIcon, CopyIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

interface ExportPanelProps {
  presentation: Presentation | null;
  onClose: () => void;
}

export function ExportPanel({ presentation, onClose }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState<'markdown' | 'html' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!presentation) {
    return null;
  }

  const generateContent = () => {
    switch (exportFormat) {
      case 'markdown':
        return slidesToMarkdown(presentation.slides);
      
      case 'html':
        return generateHTML();
      
      case 'json':
        return JSON.stringify(presentation, null, 2);
      
      default:
        return slidesToMarkdown(presentation.slides);
    }
  };

  const generateHTML = () => {
    const slides = presentation.slides.map((slide, index) => {
      return `
<section class="slide" id="slide-${index + 1}">
  <div class="slide-content">
    ${slide.content.replace(/\n/g, '<br>')}
  </div>
</section>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentation.title}</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
        .slide { margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .slide-content { max-width: none; }
        h1 { color: #1f2937; margin-bottom: 16px; }
        h2 { color: #374151; margin-bottom: 12px; }
        p { color: #4b5563; line-height: 1.6; }
        ul, ol { padding-left: 24px; }
        li { margin-bottom: 4px; }
        code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
        pre { background: #1f2937; color: #f9fafb; padding: 16px; border-radius: 8px; overflow-x: auto; }
        blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; font-style: italic; }
    </style>
</head>
<body>
    <h1>${presentation.title}</h1>
    ${slides}
</body>
</html>`;
  };

  const getFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const safeName = presentation.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    switch (exportFormat) {
      case 'markdown':
        return `${safeName}-${timestamp}.md`;
      case 'html':
        return `${safeName}-${timestamp}.html`;
      case 'json':
        return `${safeName}-${timestamp}.json`;
      default:
        return `${safeName}-${timestamp}.md`;
    }
  };

  const getMimeType = () => {
    switch (exportFormat) {
      case 'markdown':
        return 'text/markdown';
      case 'html':
        return 'text/html';
      case 'json':
        return 'application/json';
      default:
        return 'text/plain';
    }
  };

  const handleDownload = () => {
    const content = generateContent();
    const fileName = getFileName();
    const mimeType = getMimeType();
    downloadAsFile(content, fileName, mimeType);
  };

  const handleCopy = async () => {
    const content = generateContent();
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const content = generateContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Export Presentation</h2>
          <IconButton onClick={onClose} title="Close">
            <XIcon className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Format selection */}
        <div className="p-6 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="flex space-x-2">
            {(['markdown', 'html', 'json'] as const).map((format) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  exportFormat === format
                    ? 'bg-primary-100 text-primary-700 border-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 p-6 overflow-hidden">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preview
          </label>
          <div className="h-64 border rounded-md overflow-auto bg-gray-50 p-4">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {content}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            File: {getFileName()}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="flex items-center space-x-2"
            >
              <CopyIcon className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
