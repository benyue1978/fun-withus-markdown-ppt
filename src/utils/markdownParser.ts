import { Slide, SlideParseResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parse markdown content into slides separated by ---
 */
export function parseMarkdownSlides(content: string): SlideParseResult {
  const errors: string[] = [];
  
  try {
    // Split content by --- separators
    const rawSlides = content.split(/^---\s*$/m);
    
    // Filter out empty slides and trim whitespace
    const validSlides = rawSlides
      .map(slide => slide.trim())
      .filter(slide => slide.length > 0);
    
    if (validSlides.length === 0) {
      errors.push('No valid slides found. Please add some content.');
      return { slides: [], errors };
    }
    
    // Convert to Slide objects
    const slides: Slide[] = validSlides.map((content, index) => ({
      id: uuidv4(),
      content,
      title: extractSlideTitle(content),
      order: index
    }));
    
    return { slides, errors };
  } catch (error) {
    errors.push(`Error parsing markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { slides: [], errors };
  }
}

/**
 * Extract title from slide content (first heading)
 */
export function extractSlideTitle(content: string): string {
  // Look for first heading (# ## ### etc)
  const headingMatch = content.match(/^#{1,6}\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // Fallback: use first line, truncated
  const firstLine = content.split('\n')[0].trim();
  if (firstLine.length > 0) {
    return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine;
  }
  
  return 'Untitled Slide';
}

/**
 * Convert slides back to markdown format
 */
export function slidesToMarkdown(slides: Slide[]): string {
  return slides
    .sort((a, b) => a.order - b.order)
    .map(slide => slide.content)
    .join('\n\n---\n\n');
}

/**
 * Validate markdown content for common issues
 */
export function validateMarkdown(content: string): string[] {
  const warnings: string[] = [];
  
  if (content.trim().length === 0) {
    warnings.push('Content is empty');
    return warnings;
  }
  
  // Check for unbalanced code blocks
  const codeBlocks = content.match(/```/g);
  if (codeBlocks && codeBlocks.length % 2 !== 0) {
    warnings.push('Unbalanced code blocks detected (missing closing ```)');
  }
  
  // Check for very long slides
  const slides = content.split(/^---\s*$/m);
  slides.forEach((slide, index) => {
    if (slide.length > 2000) {
      warnings.push(`Slide ${index + 1} is very long (${slide.length} characters). Consider splitting it.`);
    }
  });
  
  return warnings;
}

/**
 * Generate a new slide template
 */
export function createSlideTemplate(title: string = 'New Slide'): string {
  return `# ${title}

- Your content here
- Add bullet points
- Or any markdown content

`;
}
