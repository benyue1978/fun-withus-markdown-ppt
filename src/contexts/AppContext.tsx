'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Presentation, Slide } from '@/types';
import { parseMarkdownSlides, slidesToMarkdown, createSlideTemplate, extractSlideTitle } from '@/utils/markdownParser';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

// Action types
type AppAction =
  | { type: 'LOAD_PRESENTATION'; payload: Presentation }
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_SLIDE'; payload: { index: number; content: string } }
  | { type: 'ADD_SLIDE'; payload?: { index?: number; content?: string } }
  | { type: 'DELETE_SLIDE'; payload: number }
  | { type: 'REORDER_SLIDES'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'UPDATE_CONTENT'; payload: string }
  | { type: 'RESET_PRESENTATION' };

// Initial state
const initialState: AppState = {
  presentation: null,
  currentSlideIndex: 0,
  isEditing: true,
  sidebarCollapsed: false,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_PRESENTATION':
      return {
        ...state,
        presentation: action.payload,
        currentSlideIndex: 0,
      };

    case 'SET_CURRENT_SLIDE':
      return {
        ...state,
        currentSlideIndex: Math.max(0, Math.min(action.payload, (state.presentation?.slides.length || 1) - 1)),
      };

    case 'SET_EDITING':
      return {
        ...state,
        isEditing: action.payload,
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };

    case 'UPDATE_SLIDE':
      if (!state.presentation) return state;
      const updatedSlides = [...state.presentation.slides];
      if (updatedSlides[action.payload.index]) {
        updatedSlides[action.payload.index] = {
          ...updatedSlides[action.payload.index],
          content: action.payload.content,
          title: extractSlideTitle(action.payload.content),
        };
      }
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: updatedSlides,
          updatedAt: new Date(),
        },
      };

    case 'ADD_SLIDE':
      console.log('ADD_SLIDE action called:', action.payload);
      if (!state.presentation) {
        console.log('No presentation found, returning state');
        return state;
      }
      
      const newSlide: Slide = {
        id: uuidv4(),
        content: action.payload?.content || createSlideTemplate(),
        title: 'New Slide',
        order: action.payload?.index ?? state.presentation.slides.length,
      };
      
      const slidesWithNew = [...state.presentation.slides];
      const insertIndex = action.payload?.index ?? slidesWithNew.length;
      console.log('Inserting new slide at index:', insertIndex, 'total slides before:', slidesWithNew.length);
      
      slidesWithNew.splice(insertIndex, 0, newSlide);
      
      // Update order for all slides
      slidesWithNew.forEach((slide, index) => {
        slide.order = index;
      });

      console.log('New slides array length:', slidesWithNew.length);
      
      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: slidesWithNew,
          updatedAt: new Date(),
        },
        currentSlideIndex: insertIndex,
      };

    case 'DELETE_SLIDE':
      if (!state.presentation || state.presentation.slides.length <= 1) return state;
      const filteredSlides = state.presentation.slides.filter((_, index) => index !== action.payload);
      
      // Update order for remaining slides
      filteredSlides.forEach((slide, index) => {
        slide.order = index;
      });

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: filteredSlides,
          updatedAt: new Date(),
        },
        currentSlideIndex: Math.min(state.currentSlideIndex, filteredSlides.length - 1),
      };

    case 'REORDER_SLIDES':
      if (!state.presentation) return state;
      const { fromIndex, toIndex } = action.payload;
      const reorderedSlides = [...state.presentation.slides];
      const [movedSlide] = reorderedSlides.splice(fromIndex, 1);
      reorderedSlides.splice(toIndex, 0, movedSlide);
      
      // Update order for all slides
      reorderedSlides.forEach((slide, index) => {
        slide.order = index;
      });

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: reorderedSlides,
          updatedAt: new Date(),
        },
        currentSlideIndex: toIndex,
      };

    case 'UPDATE_CONTENT':
      const parseResult = parseMarkdownSlides(action.payload);
      if (parseResult.slides.length === 0) return state;
      
      // Update slide titles after parsing
      const parsedSlides = parseResult.slides.map(slide => ({
        ...slide,
        title: extractSlideTitle(slide.content),
      }));
      
      const newPresentation: Presentation = {
        id: state.presentation?.id || uuidv4(),
        title: parsedSlides[0]?.title || 'Untitled Presentation',
        slides: parsedSlides,
        createdAt: state.presentation?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      return {
        ...state,
        presentation: newPresentation,
        currentSlideIndex: Math.min(state.currentSlideIndex, parsedSlides.length - 1),
      };

    case 'RESET_PRESENTATION':
      const defaultContent = `# Welcome to Markdown PPT Previewer

This is your first slide! 🎉

Start editing to create your presentation.

---

# Getting Started

1. Click "Edit" to modify content
2. Use \`---\` to separate slides
3. Navigate with arrow keys
4. Export when ready

**Happy presenting!** 🚀`;

      const defaultParseResult = parseMarkdownSlides(defaultContent);
      return {
        ...initialState,
        presentation: {
          id: uuidv4(),
          title: 'New Presentation',
          slides: defaultParseResult.slides.length > 0 ? defaultParseResult.slides : [{
            id: uuidv4(),
            content: createSlideTemplate('Welcome'),
            title: 'Welcome',
            order: 0,
          }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load presentation from localStorage on mount
  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window !== 'undefined') {
      const stored = loadFromLocalStorage();
      if (stored) {
        dispatch({ type: 'LOAD_PRESENTATION', payload: stored });
      } else {
        dispatch({ type: 'RESET_PRESENTATION' });
      }
    }
  }, []);

  // Save to localStorage whenever presentation changes
  useEffect(() => {
    if (state.presentation) {
      saveToLocalStorage(state.presentation);
    }
  }, [state.presentation]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
