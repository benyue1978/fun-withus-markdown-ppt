import { useRef, useCallback } from 'react';
import { AutoScrollManager, AutoScrollConfig } from '@/utils/autoScroll';

interface UseAutoScrollOptions {
  config?: AutoScrollConfig;
}

/**
 * Custom hook for managing auto-scroll during drag operations
 */
export function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const scrollManagerRef = useRef<AutoScrollManager | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  
  // Initialize scroll manager
  const getScrollManager = useCallback(() => {
    if (!scrollManagerRef.current) {
      scrollManagerRef.current = new AutoScrollManager(options.config);
    }
    return scrollManagerRef.current;
  }, [options.config]);
  
  /**
   * Set the scrollable container
   */
  const setContainer = useCallback((container: HTMLElement | null) => {
    containerRef.current = container;
  }, []);
  
  /**
   * Start auto-scrolling when drag enters the container
   */
  const startAutoScroll = useCallback((clientY: number) => {
    if (!containerRef.current) return;
    
    const scrollManager = getScrollManager();
    scrollManager.start(containerRef.current, clientY);
  }, [getScrollManager]);
  
  /**
   * Update auto-scroll position during drag
   */
  const updateAutoScroll = useCallback((clientY: number) => {
    const scrollManager = getScrollManager();
    scrollManager.update(clientY);
  }, [getScrollManager]);
  
  /**
   * Stop auto-scrolling
   */
  const stopAutoScroll = useCallback(() => {
    if (scrollManagerRef.current) {
      scrollManagerRef.current.stop();
    }
  }, []);
  
  /**
   * Handle drag over event with auto-scroll
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateAutoScroll(e.clientY);
  }, [updateAutoScroll]);
  
  /**
   * Handle drag enter event
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startAutoScroll(e.clientY);
  }, [startAutoScroll]);
  
  /**
   * Handle drag leave event
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only stop if we're leaving the container (not moving to a child)
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      stopAutoScroll();
    }
  }, [stopAutoScroll]);
  
  /**
   * Handle drag end event
   */
  const handleDragEnd = useCallback(() => {
    stopAutoScroll();
  }, [stopAutoScroll]);
  
  return {
    setContainer,
    startAutoScroll,
    updateAutoScroll,
    stopAutoScroll,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
  };
}
