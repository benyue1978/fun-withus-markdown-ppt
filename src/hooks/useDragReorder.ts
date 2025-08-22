import { useState, useCallback } from 'react';
import { 
  DragState, 
  DragPosition, 
  initialDragState,
  calculateTargetIndex,
  shouldReorderSlides 
} from '@/utils/dragUtils';

interface UseDragReorderParams {
  onReorder: (fromIndex: number, toIndex: number) => void;
}

interface UseDragReorderReturn {
  dragState: DragState;
  handleDragStart: (index: number) => void;
  handleDragOver: (index: number, position: DragPosition) => void;
  handleDragEnd: () => void;
  clearDragState: () => void;
}

/**
 * Custom hook to manage drag and drop reordering state
 */
export function useDragReorder({ onReorder }: UseDragReorderParams): UseDragReorderReturn {
  const [dragState, setDragState] = useState<DragState>(initialDragState);

  const handleDragStart = useCallback((index: number) => {
    setDragState(prev => ({
      ...prev,
      draggedIndex: index,
    }));
  }, []);

  const handleDragOver = useCallback((index: number, position: DragPosition) => {
    setDragState(prev => ({
      ...prev,
      dragOverIndex: index,
      dragOverPosition: position,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    const { draggedIndex, dragOverIndex, dragOverPosition } = dragState;
    
    if (shouldReorderSlides(draggedIndex, dragOverIndex)) {
      const targetIndex = calculateTargetIndex(
        draggedIndex!,
        dragOverIndex!,
        dragOverPosition!
      );
      
      onReorder(draggedIndex!, targetIndex);
    }
    
    setDragState(initialDragState);
  }, [dragState, onReorder]);

  const clearDragState = useCallback(() => {
    setDragState(initialDragState);
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    clearDragState,
  };
}
