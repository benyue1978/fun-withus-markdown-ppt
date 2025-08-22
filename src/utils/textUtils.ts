/**
 * Text processing utilities for slide content
 */

const PREVIEW_MAX_LENGTH = 100;

/**
 * Clean markdown content for preview display
 */
export function cleanMarkdownForPreview(content: string): string {
  return content
    .replace(/^#{1,6}\s+/gm, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '[code block]') // Replace code blocks
    .replace(/^\s*[-*+]\s+/gm, '• ') // Convert list items
    .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists
    .trim();
}

/**
 * Generate preview text with ellipsis if needed
 */
export function generatePreviewText(content: string): string {
  const cleanContent = cleanMarkdownForPreview(content);
  const truncated = cleanContent.substring(0, PREVIEW_MAX_LENGTH);
  
  return cleanContent.length > PREVIEW_MAX_LENGTH
    ? `${truncated}...`
    : truncated;
}
