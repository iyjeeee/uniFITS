# uniFITS — Website

React + Vite frontend for the uniFITS Financial Information Tracking System.

## Setup

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Start dev server
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Structure

```
website/
├── src/
│   ├── api/            # Mock data / API calls
│   ├── assets/         # Images, SVGs
│   ├── components/     # Reusable components
│   ├── constants/      # App-wide constants
│   ├── context/        # React context providers
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Page layout wrappers
│   ├── pages/          # Route-level page components
│   ├── utils/          # Utility functions
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── .env.example
```
