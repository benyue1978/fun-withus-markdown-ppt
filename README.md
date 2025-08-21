# Markdown PPT Previewer

A real-time Markdown PPT previewer that converts Markdown documents separated by `---` into slide-by-slide presentations. Perfect for content review and fine-tuning before uploading to platforms like gamma.app.

<https://markdown.withus.fun>

## 🚀 Features

- **Real-time Markdown Parsing**: Converts `---` separated content into individual slides
- **File Import**: Open Markdown files or drag & drop them onto the page
- **Dynamic Slide Splitting**: Type `---` in editor to automatically create new slides
- **Live Preview**: Instant rendering of slides with proper Markdown styling
- **Split View Editing**: Side-by-side editor and preview for efficient editing
- **Drag & Drop Reordering**: Rearrange slides by dragging thumbnails
- **Smart Slide Management**: Add, delete slides with intelligent positioning
- **Export Options**: Export to Markdown, HTML, or JSON formats
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Auto-save**: Automatic local storage of your presentations
- **Keyboard Navigation**: Arrow keys for slide navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown with remark-gfm
- **State Management**: React Context + useReducer
- **Storage**: localStorage for persistence

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd markdown-ppt-previewer
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating Slides

1. **Import existing files**: Click "Import MD" or drag & drop `.md` files
2. **Create new content**: Enter your Markdown content in the editor
3. **Use `---` to separate slides**:

```markdown
# Welcome Slide
This is the first slide with some content.

---

# Second Slide
- Bullet point 1
- Bullet point 2
- Bullet point 3

---

# Code Example
```javascript
function hello() {
  console.log("Hello, World!");
}
```

### Slide Management

- **Add Slides**: Click the "+" button to add after current slide
- **Reorder Slides**: Drag slide thumbnails in the sidebar
- **Dynamic Splitting**: Type `---` in editor to split content into multiple slides
- **Delete Slides**: Click the trash icon on slide thumbnails

### Navigation

- **Arrow Keys**: Navigate between slides
- **Space Bar**: Next slide
- **Home/End**: First/Last slide
- **Tab**: Indent in editor
- **Shift+Tab**: Unindent in editor

### Editing Modes

- **Preview Mode**: Full-screen slide preview
- **Edit Mode**: Split view with editor and preview
- **Mobile**: Toggleable editor/preview

### Export Options

- **Markdown**: Original format with slide separators
- **HTML**: Standalone HTML file with styling
- **JSON**: Complete presentation data structure

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
# or
pnpm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── ui/            # Base UI components
│   ├── icons/         # Icon components
│   ├── Header.tsx     # App header
│   ├── Sidebar.tsx    # Slide list sidebar
│   ├── MainContent.tsx # Main content area
│   ├── SlidePreview.tsx # Individual slide preview
│   ├── SlideEditor.tsx  # Markdown editor
│   └── ExportPanel.tsx  # Export functionality
├── contexts/          # React contexts
│   └── AppContext.tsx # Main app state
├── types/            # TypeScript type definitions
│   └── index.ts
└── utils/            # Utility functions
    ├── markdownParser.ts # Markdown processing
    ├── storage.ts       # Local storage helpers
    └── cn.ts           # Class name utility
```

## 🎨 Supported Markdown

- **Headings**: `# ## ### #### ##### ######`
- **Text Formatting**: `**bold**`, `*italic*`, `~~strikethrough~~`
- **Lists**: Bulleted (`-`, `*`, `+`) and numbered (`1.`)
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Code**: Inline `` `code` `` and fenced ``` blocks
- **Blockquotes**: `> quoted text`
- **Horizontal Rules**: `---`, `***`, `___`
- **Tables**: GitHub Flavored Markdown tables
- **Task Lists**: `- [ ]` and `- [x]`

## 🎯 Roadmap

- [ ] Slide templates and themes
- [ ] Drag & drop slide reordering
- [ ] Collaborative editing
- [ ] Cloud storage integration
- [ ] Presentation mode (full-screen)
- [ ] PDF export
- [ ] Custom CSS themes
- [ ] Slide transitions
- [ ] Speaker notes
- [ ] Image upload and management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [react-markdown](https://github.com/remarkjs/react-markdown) for Markdown rendering
- [Heroicons](https://heroicons.com/) for the beautiful icons

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/benyue1978/markdown-ppt-previewer/issues) on GitHub.

---

Made with ❤️ for better presentation workflows.
