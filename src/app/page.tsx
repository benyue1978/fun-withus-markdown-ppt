'use client';

import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { DragDropImport } from '@/components/DragDropImport';

export default function HomePage() {
  return (
    <AppProvider>
      <DragDropImport className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Main layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            <MainContent />
          </div>
        </div>
      </DragDropImport>
    </AppProvider>
  );
}
