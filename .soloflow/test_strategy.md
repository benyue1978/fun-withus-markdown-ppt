# Test Strategy

## Test Objectives
- Ensure Markdown parsing accuracy
- Verify slide rendering correctness
- Test real-time editing functionality
- Validate export functionality
- Ensure cross-browser compatibility
- Test responsive design on different screen sizes

## Test Types

### Unit Tests
- **Markdown Parser Tests**
  - Test `---` separator detection
  - Test edge cases (empty slides, malformed separators)
  - Test different Markdown syntax elements

- **Component Tests**
  - Test slide preview rendering
  - Test editor input handling
  - Test navigation controls

- **Utility Function Tests**
  - Test slide title extraction
  - Test export format generation
  - Test validation functions

### Integration Tests
- **Editor-Preview Synchronization**
  - Test real-time updates between editor and preview
  - Test auto-save functionality
  - Test undo/redo operations

- **Slide Management**
  - Test add/delete slide operations
  - Test slide reordering
  - Test slide duplication

### End-to-End Tests
- **User Workflow Tests**
  - Complete presentation creation flow
  - Export and sharing functionality
  - Keyboard navigation and accessibility

## Test Environment
- **Development Environment**: Local development with hot reload
- **Test Environment**: Jest + React Testing Library
- **Browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Desktop, tablet, mobile

## Testing Tools
- **Jest** for test runner and assertions
- **React Testing Library** for component testing
- **Playwright** for E2E testing
- **MSW** for API mocking (if needed)

## Test Coverage Goals
- **Unit Tests**: >90% coverage
- **Integration Tests**: >80% coverage
- **E2E Tests**: Critical user paths covered

## Update History
- 2025-01-27: Initial test strategy definition