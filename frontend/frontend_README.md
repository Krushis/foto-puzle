# FotoPuzle — Frontend

React 19 single-page application built with Vite. Provides the user interface for photo uploads, puzzle generation and play, order management, and authentication.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18.x or later |
| npm | 9.x or later (bundled with Node) |

Verify:

```bash
node --version
npm --version
```

---

## Setup

### 1. Navigate to the frontend directory

```bash
cd foto-puzle/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API base URL

Create a `.env.local` file (Git-ignored) in the `frontend/` directory:

```env
VITE_API_URL=https://localhost:7xxx
```

Replace `7xxx` with the port your backend is running on (shown in terminal when you run `dotnet run`).

### 4. Start the dev server

```bash
npm run dev
```

The app opens at `http://localhost:5173` by default, with Hot Module Replacement (HMR) enabled.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Layout

```
frontend/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   ├── services/       # API call functions
│   ├── context/        # React context (auth, etc.)
│   └── main.jsx        # App entry point
├── index.html
└── vite.config.js
```

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| React Router | Client-side routing |
| Axios / Fetch | HTTP requests to the backend API |

### Vite plugins

- `@vitejs/plugin-react` — uses Babel / oxc for Fast Refresh
- `@vitejs/plugin-react-swc` — alternative using SWC for faster builds

---

## Connecting to the Backend

All API calls target the URL set in `VITE_API_URL`. Make sure the backend is running before starting the frontend. Auth tokens are stored in memory / localStorage and sent as `Authorization: Bearer <token>` headers on protected requests.

---

## Troubleshooting

**Blank page / cannot connect to API**
Check that `VITE_API_URL` in `.env.local` matches the port printed by `dotnet run`, and that the backend is actually running.

**CORS errors in browser console**
The backend must have CORS configured to allow `http://localhost:5173`. Check the CORS policy in `Program.cs`.

**`npm install` fails**
Confirm Node.js 18+ is installed: `node --version`. Delete `node_modules/` and `package-lock.json`, then retry.

**Port 5173 already in use**
Vite will automatically try the next available port and print it in the terminal.
