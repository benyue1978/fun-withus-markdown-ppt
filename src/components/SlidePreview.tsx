'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Slide } from '@/types';
import { cn } from '@/utils/cn';

interface SlidePreviewProps {
  slide: Slide;
  className?: string;
  isActive?: boolean;
}

export function SlidePreview({ slide, className, isActive = false }: SlidePreviewProps) {
  return (
    <div
      className={cn(
        'w-full h-full bg-white rounded-lg shadow-sm border overflow-auto',
        'transition-all duration-200',
        isActive && 'ring-2 ring-primary-500 shadow-md',
        className
      )}
    >
      <div className="p-6 h-full">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose prose-gray max-w-none h-full"
          components={{
            h1: ({ children, ...props }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="text-2xl font-semibold text-gray-800 mb-3" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="text-xl font-medium text-gray-700 mb-2" {...props}>
                {children}
              </h3>
            ),
            p: ({ children, ...props }) => (
              <p className="text-gray-700 mb-3 leading-relaxed" {...props}>
                {children}
              </p>
            ),
            ul: ({ children, ...props }) => (
              <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li className="text-gray-700" {...props}>
                {children}
              </li>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote
                className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4"
                {...props}
              >
                {children}
              </blockquote>
            ),
            code: ({ children, className, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code
                  className="block bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre: ({ children, ...props }) => (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto mb-4" {...props}>
                {children}
              </pre>
            ),
            a: ({ children, ...props }) => (
              <a
                className="text-primary-600 hover:text-primary-700 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            ),
            strong: ({ children, ...props }) => (
              <strong className="font-semibold text-gray-900" {...props}>
                {children}
              </strong>
            ),
            em: ({ children, ...props }) => (
              <em className="italic text-gray-700" {...props}>
                {children}
              </em>
            ),
            hr: ({ ...props }) => (
              <hr className="border-gray-300 my-6" {...props} />
            ),
          }}
        >
          {slide.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
