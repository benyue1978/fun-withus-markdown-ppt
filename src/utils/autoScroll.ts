/**
 * Auto-scroll utilities for drag and drop
 */

export interface AutoScrollConfig {
  /** Distance from edge to start scrolling (px) */
  threshold: number;
  /** Maximum scroll speed (px per frame) */
  maxSpeed: number;
  /** Acceleration factor */
  acceleration: number;
}

export const DEFAULT_AUTO_SCROLL_CONFIG: AutoScrollConfig = {
  threshold: 100,
  maxSpeed: 2,
  acceleration: 0.1,
};

/**
 * Calculate scroll direction and speed based on mouse position
 */
export function calculateAutoScroll(
  mouseY: number,
  containerRect: DOMRect,
  config: AutoScrollConfig = DEFAULT_AUTO_SCROLL_CONFIG
): { direction: 'up' | 'down' | null; speed: number } {
  const { threshold, maxSpeed, acceleration } = config;
  const { top, bottom } = containerRect;
  
  // Distance from top edge
  const distanceFromTop = mouseY - top;
  // Distance from bottom edge
  const distanceFromBottom = bottom - mouseY;
  
  // Check if mouse is near top edge
  if (distanceFromTop < threshold && distanceFromTop > 0) {
    const intensity = (threshold - distanceFromTop) / threshold;
    // Use quadratic easing for smoother acceleration
    const easedIntensity = intensity * intensity;
    const speed = Math.min(maxSpeed, easedIntensity * maxSpeed + 0.5); // Minimum speed of 0.5px
    return { direction: 'up', speed };
  }
  
  // Check if mouse is near bottom edge
  if (distanceFromBottom < threshold && distanceFromBottom > 0) {
    const intensity = (threshold - distanceFromBottom) / threshold;
    // Use quadratic easing for smoother acceleration
    const easedIntensity = intensity * intensity;
    const speed = Math.min(maxSpeed, easedIntensity * maxSpeed + 0.5); // Minimum speed of 0.5px
    return { direction: 'down', speed };
  }
  
  return { direction: null, speed: 0 };
}

/**
 * Auto-scroll manager class
 */
export class AutoScrollManager {
  private animationFrame: number | null = null;
  private container: HTMLElement | null = null;
  private config: AutoScrollConfig;
  
  constructor(config: AutoScrollConfig = DEFAULT_AUTO_SCROLL_CONFIG) {
    this.config = config;
  }
  
  /**
   * Start auto-scrolling
   */
  start(container: HTMLElement, mouseY: number) {
    this.container = container;
    this.scroll(mouseY);
  }
  
  /**
   * Update mouse position and continue scrolling
   */
  update(mouseY: number) {
    if (!this.container) return;
    this.scroll(mouseY);
  }
  
  /**
   * Stop auto-scrolling
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.container = null;
  }
  
  /**
   * Perform the actual scrolling
   */
  private scroll(mouseY: number) {
    if (!this.container) return;
    
    const containerRect = this.container.getBoundingClientRect();
    const { direction, speed } = calculateAutoScroll(mouseY, containerRect, this.config);
    
    if (direction && speed > 0) {
      const scrollDelta = direction === 'up' ? -speed : speed;
      this.container.scrollTop += scrollDelta;
      
      // Continue scrolling
      this.animationFrame = requestAnimationFrame(() => {
        this.scroll(mouseY);
      });
    } else {
      // Stop scrolling if no direction or speed
      this.stop();
    }
  }
}
