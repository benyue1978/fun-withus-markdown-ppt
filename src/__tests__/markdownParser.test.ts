import { parseMarkdownSlides, extractSlideTitle, slidesToMarkdown, validateMarkdown } from '@/utils/markdownParser';

describe('markdownParser', () => {
  describe('parseMarkdownSlides', () => {
    it('should parse slides separated by ---', () => {
      const content = `# Slide 1
Content 1

---

# Slide 2
Content 2`;

      const result = parseMarkdownSlides(content);
      expect(result.slides).toHaveLength(2);
      expect(result.slides[0].content).toContain('# Slide 1');
      expect(result.slides[1].content).toContain('# Slide 2');
    });

    it('should handle empty content', () => {
      const result = parseMarkdownSlides('');
      expect(result.slides).toHaveLength(0);
      expect(result.errors).toContain('No valid slides found. Please add some content.');
    });

    it('should filter out empty slides', () => {
      const content = `# Slide 1
Content 1

---

---

# Slide 2
Content 2`;

      const result = parseMarkdownSlides(content);
      expect(result.slides).toHaveLength(2);
    });
  });

  describe('extractSlideTitle', () => {
    it('should extract title from heading', () => {
      const content = '# Main Title\nSome content';
      expect(extractSlideTitle(content)).toBe('Main Title');
    });

    it('should handle different heading levels', () => {
      const content = '## Secondary Title\nSome content';
      expect(extractSlideTitle(content)).toBe('Secondary Title');
    });

    it('should use first line as fallback', () => {
      const content = 'No heading here\nSome content';
      expect(extractSlideTitle(content)).toBe('No heading here');
    });

    it('should return default title for empty content', () => {
      expect(extractSlideTitle('')).toBe('Untitled Slide');
    });

    it('should truncate long titles', () => {
      const longTitle = 'This is a very long title that should be truncated because it exceeds the maximum length';
      expect(extractSlideTitle(longTitle)).toMatch(/\.\.\.$/);
    });
  });

  describe('slidesToMarkdown', () => {
    it('should convert slides back to markdown', () => {
      const slides = [
        { id: '1', content: '# Slide 1', title: 'Slide 1', order: 0 },
        { id: '2', content: '# Slide 2', title: 'Slide 2', order: 1 },
      ];

      const result = slidesToMarkdown(slides);
      expect(result).toContain('# Slide 1');
      expect(result).toContain('# Slide 2');
      expect(result).toContain('---');
    });

    it('should sort slides by order', () => {
      const slides = [
        { id: '1', content: '# Slide 2', title: 'Slide 2', order: 1 },
        { id: '2', content: '# Slide 1', title: 'Slide 1', order: 0 },
      ];

      const result = slidesToMarkdown(slides);
      const slide1Index = result.indexOf('# Slide 1');
      const slide2Index = result.indexOf('# Slide 2');
      expect(slide1Index).toBeLessThan(slide2Index);
    });
  });

  describe('validateMarkdown', () => {
    it('should detect unbalanced code blocks', () => {
      const content = '```javascript\nconst x = 1;\n';
      const warnings = validateMarkdown(content);
      expect(warnings).toContain('Unbalanced code blocks detected (missing closing ```)');
    });

    it('should warn about very long slides', () => {
      const longContent = 'a'.repeat(2500);
      const warnings = validateMarkdown(longContent);
      expect(warnings.some(w => w.includes('very long'))).toBe(true);
    });

    it('should return warning for empty content', () => {
      const warnings = validateMarkdown('');
      expect(warnings).toContain('Content is empty');
    });

    it('should return no warnings for valid content', () => {
      const content = '# Title\nSome content\n```js\ncode\n```';
      const warnings = validateMarkdown(content);
      expect(warnings).toHaveLength(0);
    });
  });
});
