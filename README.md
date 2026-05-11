# FotoPuzle

A full-stack web application that lets users upload photos and turn them into interactive jigsaw puzzles. Users can manage their photos, generate puzzles with configurable difficulty, complete them, and place print orders.

---

## Project Structure

```
foto-puzle/
├── backend/        # .NET 8 REST API
├── frontend/       # React + Vite SPA
└── docs/           # Additional documentation
```

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, JavaScript |
| Backend | .NET 8, ASP.NET Core Web API |
| Database | MySQL 8 via Entity Framework Core (Pomelo) |
| Auth | JWT Bearer tokens |

---

## Getting Started

Each part of the project has its own setup guide:

- **[Backend README](backend/README.md)** — .NET API setup, running the server
- **[Database README](backend/DB_README.md)** — MySQL setup, EF Core migrations
- **[Frontend README](frontend/README.md)** — React + Vite dev server setup

For a full local environment, set up all three in order: **Database → Backend → Frontend**.

---

## Key Features

- Photo upload and management
- Puzzle generation with configurable difficulty and piece count
- Puzzle completion tracking with token rewards
- Order placement for physical puzzle prints
- JWT-based authentication and per-user data isolation

---

