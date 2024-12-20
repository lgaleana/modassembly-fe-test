# ModAssembly Frontend

A beginner-friendly frontend application for generating and deploying autonomous software systems.

## Quick Start Guide

### Prerequisites
Before you begin, make sure you have:
1. [Node.js](https://nodejs.org/) installed (version 18 or higher)
   - To check if you have Node.js: Open terminal/command prompt and type `node --version`
   - If not installed, download and install from [Node.js website](https://nodejs.org/)

2. Package Manager (pnpm recommended)
   ```bash
   # Install pnpm globally
   npm install -g pnpm
   ```

### Setting Up Your Project
1. **Get the Code**
   ```bash
   # Clone the repository
   git clone https://github.com/lgaleana/modassembly-fe-test.git

   # Go to the project folder
   cd modassembly-fe-test
   ```

2. **Install Dependencies**
   ```bash
   # Install all required packages
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   # Run the development server
   pnpm dev
   ```

   Once started, open your web browser and go to:
   [http://localhost:5173](http://localhost:5173)

   You should see the ModAssembly interface!

### Making Changes
1. The main application code is in `src/App.tsx`
2. CSS styles are in `src/index.css`
3. Save any file to see changes instantly in the browser

### Building for Production
```bash
# Create optimized build
pnpm build

# Preview the build locally
pnpm preview
```

## Features
- Input form for system name and description
- Real-time error handling
- Dependency graph visualization
- Deployment status tracking

## Troubleshooting
Common issues and solutions:

1. **"command not found: pnpm"**
   - Run: `npm install -g pnpm`

2. **Dependencies installation fails**
   - Try: `pnpm install --force`
   - Or: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

3. **Port already in use**
   - Try a different port: `pnpm dev --port 3000`

Need more help? Create an issue in the GitHub repository!
