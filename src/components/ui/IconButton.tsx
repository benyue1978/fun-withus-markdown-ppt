'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function IconButton({
  className,
  variant = 'ghost',
  size = 'md',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Variants
        {
          'hover:bg-gray-100 active:bg-gray-200': variant === 'ghost',
          'bg-gray-200 hover:bg-gray-300 active:bg-gray-400': variant === 'solid',
        },
        
        // Sizes
        {
          'h-8 w-8': size === 'sm',
          'h-10 w-10': size === 'md',
          'h-12 w-12': size === 'lg',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
