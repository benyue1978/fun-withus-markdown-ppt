# Project Requirements

## Functional Requirements

### 1. Markdown Input & Parsing
- Parse Markdown content with `---` as slide separators
- Support standard Markdown syntax (headings, lists, bold, italic, code blocks, etc.)
- Handle edge cases (empty slides, malformed separators)
- Extract slide titles automatically from first heading

### 2. Slide Preview & Rendering
- Display each slide as a full-screen preview
- Support slide navigation (previous/next, slide thumbnails)
- Real-time markdown rendering with proper styling
- Responsive design for different screen sizes

### 3. Live Editing Capabilities
- Edit slide content in real-time
- Split view: editor on left, preview on right
- Auto-save functionality
- Undo/redo support

### 4. Slide Management
- Add new slides (insert `---` separators)
- Delete existing slides
- Reorder slides by drag & drop
- Duplicate slides

### 5. Export & Sharing
- Export as formatted Markdown
- Copy to clipboard functionality
- Save as local file
- Generate gamma.app compatible format

## Non-functional Requirements
- **Performance**: Slide rendering < 100ms
- **Usability**: Intuitive interface, minimal learning curve
- **Accessibility**: Keyboard navigation, screen reader support
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Technical Constraints
- Must work offline (no external API dependencies)
- File size < 5MB for reasonable performance
- Support for up to 100 slides per presentation

## Update History
- 2025-01-27: Initial requirements definition