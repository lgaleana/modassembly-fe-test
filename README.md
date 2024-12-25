# Architecture Graph Visualization

An interactive visualization tool for displaying system architecture components and their dependencies using React and ReactFlow.

## Features
- Interactive directed graph visualization
- Custom node components showing detailed information
- Animated connection lines showing dependencies
- MiniMap and controls for easy navigation
- Responsive layout with clean, modern design

## Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/lgaleana/modassembly-fe-test.git
cd modassembly-fe-test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure
```
modassembly-fe-test/
├── src/
│   ├── components/     # React components
│   │   └── CustomNode.tsx
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Application entry point
│   ├── types.ts       # TypeScript type definitions
│   └── index.css      # Global styles
├── public/            # Static assets
├── index.html         # HTML entry point
└── package.json       # Project dependencies and scripts
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Dependencies
- React 18.2.0
- ReactFlow 11.10.3
- TypeScript 5.7.2
- Tailwind CSS 3.4.17
- Vite 6.0.5

## Troubleshooting

### Common Issues

1. **Node Version Mismatch**
   - Ensure you're using Node.js v16 or higher
   - Use `node --version` to check your version

2. **Port Already in Use**
   - If port 3000 is already in use, Vite will automatically try the next available port
   - Check the terminal output for the correct URL

3. **Dependencies Issues**
   - If you encounter dependency conflicts, try:
     ```bash
     rm -rf node_modules package-lock.json
     npm install
     ```

For any other issues, please open an issue on the GitHub repository.
