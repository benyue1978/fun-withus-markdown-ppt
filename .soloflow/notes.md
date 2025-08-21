# Project Notes

## Development Notes

### Project Inspiration
- Created based on the need for a Markdown PPT previewer
- Specifically designed for content review before uploading to gamma.app
- Focus on simplicity and real-time editing capabilities

### Technical Decisions
- **Next.js over Create React App**: Better performance, routing, and build optimization
- **Tailwind CSS**: Rapid development and consistent design system
- **Client-side only**: No backend needed, works offline
- **TypeScript**: Better development experience and type safety

### Key Features Priority
1. **High Priority**: Markdown parsing and slide preview
2. **Medium Priority**: Real-time editing and slide management
3. **Low Priority**: Advanced themes and export formats

## Issue Records

### Potential Challenges
- **Markdown Parsing Edge Cases**: Handling malformed separators and empty slides
- **Performance**: Large presentations with many slides
- **Browser Compatibility**: Ensuring consistent behavior across browsers
- **Mobile Experience**: Touch-friendly interface for mobile devices

### Solutions Considered
- **Virtual Scrolling**: For handling large numbers of slides
- **Debounced Updates**: For real-time preview performance
- **Progressive Enhancement**: Core functionality works without JavaScript

## Implementation Notes

### Markdown Processing Strategy
- Use `---` as slide separator (standard markdown horizontal rule)
- Parse each slide independently
- Extract slide titles from first heading
- Support all standard markdown syntax

### State Management Approach
- **Local State**: Individual slide content and current slide
- **Global State**: Presentation metadata and settings
- **Persistence**: Local storage for auto-save functionality

### Component Architecture
- **Container Components**: Handle data and logic
- **Presentational Components**: Handle UI rendering
- **Custom Hooks**: Extract reusable logic

## Future Enhancements

### Version 2.0 Ideas
- **Slide Templates**: Pre-designed slide layouts
- **Collaboration**: Real-time collaborative editing
- **Cloud Storage**: Save presentations to cloud
- **Presentation Mode**: Full-screen presentation view
- **Export Formats**: PDF, PowerPoint, HTML

### Integration Possibilities
- **GitHub**: Import from repositories
- **Notion**: Import from Notion pages
- **Google Docs**: Import from Google Docs
- **API**: REST API for external integrations

## Update History
- 2025-01-27: Initial project notes and development planning