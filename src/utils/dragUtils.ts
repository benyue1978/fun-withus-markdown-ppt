/**
 * Drag and drop utilities for slide reordering
 */

export type DragPosition = 'above' | 'below';

export interface DragState {
  draggedIndex: number | null;
  dragOverIndex: number | null;
  dragOverPosition: DragPosition | null;
}

export const initialDragState: DragState = {
  draggedIndex: null,
  dragOverIndex: null,
  dragOverPosition: null,
};

/**
 * Calculate the target index for slide reordering
 */
export function calculateTargetIndex(
  draggedIndex: number,
  dragOverIndex: number,
  position: DragPosition
): number {
  let targetIndex = dragOverIndex;
  
  if (position === 'below') {
    targetIndex = dragOverIndex + 1;
  }
  
  // Adjust index if moving item forward in the list
  if (targetIndex > draggedIndex) {
    targetIndex = Math.max(0, targetIndex - 1);
  }
  
  return targetIndex;
}

/**
 * Calculate drag position based on mouse position relative to element
 */
export function calculateDragPosition(
  clientY: number,
  elementRect: DOMRect
): DragPosition {
  const elementCenterY = elementRect.top + elementRect.height / 2;
  return clientY < elementCenterY ? 'above' : 'below';
}

/**
 * Check if a drag operation should trigger reordering
 */
export function shouldReorderSlides(
  draggedIndex: number | null,
  dragOverIndex: number | null
): boolean {
  return (
    draggedIndex !== null &&
    dragOverIndex !== null &&
    draggedIndex !== dragOverIndex
  );
}
