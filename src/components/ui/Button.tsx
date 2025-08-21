'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Variants
        {
          'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400': variant === 'secondary',
          'hover:bg-gray-100 active:bg-gray-200': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800': variant === 'danger',
        },
        
        // Sizes
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
