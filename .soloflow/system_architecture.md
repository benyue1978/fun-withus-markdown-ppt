# System Architecture

## Overall Architecture
The Markdown PPT Previewer follows a client-side architecture with no backend dependencies. It's built as a single-page application that processes Markdown content entirely in the browser.

## Tech Stack

### Frontend Framework
- **React 18** with TypeScript for type safety
- **Next.js 14** for routing and build optimization
- **Tailwind CSS** for rapid UI development and consistent styling

### Markdown Processing
- **react-markdown** for rendering Markdown to React components
- **remark-gfm** for GitHub Flavored Markdown support
- **remark-parse** for parsing Markdown content
- **unified** ecosystem for text processing

### State Management
- **React Context API** for global state (current slide, editor content)
- **useState/useReducer** for local component state
- **useCallback/useMemo** for performance optimization

### UI Components
- **Custom slide components** for different content types
- **Responsive grid system** for layout management
- **Keyboard navigation** for accessibility

## Component Design

### Core Components
1. **App.tsx** - Main application container
2. **MarkdownEditor.tsx** - Text input with syntax highlighting
3. **SlidePreview.tsx** - Individual slide rendering
4. **SlideNavigator.tsx** - Slide navigation controls
5. **SlideThumbnails.tsx** - Slide overview sidebar
6. **ExportPanel.tsx** - Export and sharing options

### Utility Functions
- **parseMarkdownSlides()** - Split content by `---` separators
- **extractSlideTitle()** - Get title from slide content
- **validateMarkdown()** - Check for syntax errors
- **exportFormats()** - Generate different output formats

## Data Flow
1. User inputs Markdown text
2. Content is parsed into slide array
3. Each slide is rendered as preview
4. Edits update both editor and preview simultaneously
5. Changes are saved to local storage
6. Export generates final format

## Performance Considerations
- Virtual scrolling for large slide counts
- Debounced preview updates
- Lazy loading of slide components
- Memoized slide rendering

## Update History
- 2025-01-27: Initial architecture design