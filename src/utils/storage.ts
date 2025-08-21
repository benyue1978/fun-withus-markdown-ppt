import { Presentation } from '@/types';

const STORAGE_KEY = 'markdown-ppt-presentation';

/**
 * Save presentation to localStorage
 */
export function saveToLocalStorage(presentation: Presentation): void {
  try {
    // Check if localStorage is available (client-side only)
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    const serialized = JSON.stringify({
      ...presentation,
      createdAt: presentation.createdAt.toISOString(),
      updatedAt: presentation.updatedAt.toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load presentation from localStorage
 */
export function loadFromLocalStorage(): Presentation | null {
  try {
    // Check if localStorage is available (client-side only)
    if (typeof window === 'undefined' || !window.localStorage) return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clear stored presentation
 */
export function clearLocalStorage(): void {
  try {
    // Check if localStorage is available (client-side only)
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Export presentation as downloadable file
 */
export function downloadAsFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
