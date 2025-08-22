'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DocumentIcon } from '@/components/icons';
import { ImportModal } from './ImportModal';

interface FileImportProps {
  className?: string;
}

export function FileImport({ className }: FileImportProps) {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleButtonClick = () => {
    setShowImportModal(true);
  };

  return (
    <div className={className}>
      <Button
        variant="secondary"
        onClick={handleButtonClick}
        className="flex items-center space-x-2"
      >
        <DocumentIcon className="w-4 h-4" />
        <span>Import MD</span>
      </Button>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
}
