'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ExportPanel } from './ExportPanel';
import { FileImport } from './FileImport';
import { 
  DocumentIcon, 
  EditIcon, 
  EyeIcon, 
  DownloadIcon,
  MenuIcon 
} from '@/components/icons';
import { cn } from '@/utils/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { state, dispatch } = useApp();
  const [showExportPanel, setShowExportPanel] = useState(false);
  
  const { presentation, isEditing, sidebarCollapsed } = state;

  const toggleEditing = () => {
    dispatch({ type: 'SET_EDITING', payload: !isEditing });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const handleNewPresentation = () => {
    if (confirm('Create a new presentation? Current changes will be saved automatically.')) {
      dispatch({ type: 'RESET_PRESENTATION' });
    }
  };

  return (
    <header className={cn('bg-white border-b border-gray-200 px-4 py-3', className)}>
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle (hidden on large screens) */}
          <IconButton
            onClick={toggleSidebar}
            className="lg:hidden"
            title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
          >
            <MenuIcon className="w-5 h-5" />
          </IconButton>

          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <DocumentIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Markdown PPT Previewer
              </h1>
              {presentation && (
                <p className="text-sm text-gray-600 truncate max-w-xs">
                  {presentation.title}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Center section - View mode indicators */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => dispatch({ type: 'SET_EDITING', payload: false })}
              className={cn(
                'flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors',
                !isEditing
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <EyeIcon className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_EDITING', payload: true })}
              className={cn(
                'flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors',
                isEditing
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <EditIcon className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Mobile edit toggle */}
          <IconButton
            onClick={toggleEditing}
            className="md:hidden"
            title={isEditing ? 'Switch to preview' : 'Switch to edit'}
          >
            {isEditing ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EditIcon className="w-5 h-5" />
            )}
          </IconButton>

          {/* Import button */}
          <FileImport />

          {/* Export button */}
          <Button
            variant="secondary"
            onClick={() => setShowExportPanel(true)}
            className="flex items-center space-x-2"
          >
            <DownloadIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* New presentation button */}
          <Button
            variant="primary"
            onClick={handleNewPresentation}
            className="flex items-center space-x-2"
          >
            <DocumentIcon className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </div>

      {/* Export panel */}
      {showExportPanel && (
        <ExportPanel
          onClose={() => setShowExportPanel(false)}
          presentation={presentation}
        />
      )}
    </header>
  );
}
