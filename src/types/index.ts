// Core types for the Markdown PPT Previewer

export interface Slide {
  id: string;
  content: string;
  title: string;
  order: number;
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  presentation: Presentation | null;
  currentSlideIndex: number;
  isEditing: boolean;
  sidebarCollapsed: boolean;
}

export interface SlideParseResult {
  slides: Slide[];
  errors: string[];
}

export type ViewMode = 'split' | 'preview' | 'edit';

export interface ExportOptions {
  format: 'markdown' | 'html' | 'json';
  includeMetadata: boolean;
}
