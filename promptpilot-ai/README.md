# PromptPilot AI

A responsive AI-workspace-style frontend built with React, Vite, Tailwind CSS v4, and Lucide icons.

## Requirements

- Node.js 20.19+ or 22.12+ recommended (current Vite releases require a modern Node.js version)
- npm (included with Node.js)
- A modern browser

## Run locally

```bash
# 1. Open this project folder in your terminal
cd promptpilot-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Project structure

```text
promptpilot-ai/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── data.js
    ├── index.css
    └── main.jsx
```

## Features

- Responsive dark dashboard UI
- Prompt templates and category filters
- Local demo response engine (not a real AI model)
- Prompt history and saved favorites using browser localStorage
- Copy responses, search templates, clear history
- Keyboard shortcut: Ctrl+Enter (Windows/Linux) or Cmd+Enter (macOS)

## Tailwind CSS

Tailwind CSS v4 is configured through `@tailwindcss/vite` in `vite.config.js`. The stylesheet imports Tailwind with `@import "tailwindcss";`. Most of the app's visual styling uses hand-authored CSS in `src/index.css` for the custom dashboard design.

## Environment variables and real AI

This demo does not need a `.env` file or API key.

**Do not put private AI provider API keys in a Vite frontend variable.** Variables prefixed with `VITE_` are included in client-side bundles and can be viewed by users. For a real AI integration, create a small backend/serverless function that keeps the secret key on the server, then call that endpoint from the React app.

## Troubleshooting

- `npm` is not recognized: install Node.js LTS, then close and reopen your terminal.
- Port 5173 is busy: Vite will offer another local port.
- Dependency errors: use a supported Node version, then run `npm install` again.
- Styling not loading: confirm `src/main.jsx` imports `./index.css` and `vite.config.js` includes `tailwindcss()` from `@tailwindcss/vite`.
