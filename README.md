# modassembly-fe-test

## Local Development Setup

This guide will help you run the project locally on your machine.

### Prerequisites

1. **Node.js**: This project requires Node.js version 18 or higher
   - Download and install from [Node.js website](https://nodejs.org/)
   - Verify installation by running: `node --version`

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/lgaleana/modassembly-fe-test.git
   cd modassembly-fe-test
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
   This will install all required packages for the project.

3. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the development server at http://localhost:5173

### Project Structure

The project is a React application with TypeScript and includes:
- Input form for project details
- Directed graph visualization
- Progress indicator and backend link display

### Troubleshooting

If you encounter any issues:
1. Make sure Node.js is installed correctly
2. Try removing node_modules and package-lock.json and running `npm install` again
3. Clear your browser cache if the page doesn't load properly

For more detailed technical information, check the frontend/README.md file.
