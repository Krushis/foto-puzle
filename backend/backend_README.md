# FotoPuzle — Backend

ASP.NET Core 8 REST API for the FotoPuzle application. Handles authentication, photo/puzzle management, completion tokens, and order processing.

---

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| .NET SDK | 8.x | https://dotnet.microsoft.com/download/dotnet/8.0 |
| MySQL Server | 8.x | https://dev.mysql.com/downloads/mysql/ |
| EF Core CLI | latest | `dotnet tool install --global dotnet-ef` |

Verify your .NET installation:

```bash
dotnet --version
# Should output 8.x.x
```

MySQL Workbench or phpMyAdmin are optional but useful for visually inspecting the database.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Krushis/foto-puzle.git
cd foto-puzle/backend/FotoPuzleBackend/FotoPuzleBackend
```

### 2. Configure the database connection

Open `appsettings.Development.json` (click the arrow next to `appsettings.json` in your IDE to reveal it) and set your MySQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=YOUR_DB_NAME;User=root;Password=YOUR_PASSWORD;"
  }
}
```

- Replace `YOUR_PASSWORD` with your MySQL root password.
- Replace `YOUR_DB_NAME` with the schema name you created in MySQL.
- Leave `Server=localhost` unless MySQL is running on a different host.

> `appsettings.Development.json` is excluded from Git so credentials are never committed.

### 3. Restore packages

```bash
dotnet restore
```

Downloads all NuGet packages (EF Core, Pomelo MySQL provider, JWT libraries, etc.).

### 4. Build

```bash
dotnet build
```

Confirms the project compiles cleanly before you run migrations.

### 5. Apply database migrations

```bash
dotnet ef migrations list   # should show: InitialCreate
dotnet ef database update   # creates tables in MySQL
```

See [DB_README.md](DB_README.md) for full database setup details.

### 6. Run the API

```bash
dotnet run
```

The API starts on `https://localhost:7xxx` / `http://localhost:5xxx` (exact port shown in terminal output). Swagger UI is available at `/swagger` in Development mode.

---

## Project Layout

```
FotoPuzleBackend/
├── Controllers/        # API endpoints
├── Services/           # Business logic
├── Repositories/       # Data access layer
├── Models/
│   ├── Entities/       # EF Core entity classes
│   └── DTO/            # Request/response shapes
├── Middleware/         # Error handling middleware
├── Data/               # AppDbContext
├── Migrations/         # EF Core migration files
└── appsettings.json
```

---

## API Overview

| Area | Base Route |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET/PUT /api/user/{id}` |
| Photos | `GET/POST/DELETE /api/photo` |
| Puzzles | `GET/POST /api/puzzle` |
| Completion Tokens | `GET/POST /api/completiontoken` |
| Orders | `GET/POST /api/order` |

All protected routes require a `Bearer` token in the `Authorization` header.

---

## Error Handling

Unhandled exceptions are caught by `ErrorHandlingMiddleware` and returned as structured JSON:

```json
{
  "error": "Descriptive message",
  "statusCode": 400
}
```

Exception-to-status mapping:

| Exception | HTTP Status |
|---|---|
| `InvalidOperationException` | 400 Bad Request |
| `ArgumentException` | 400 Bad Request |
| `KeyNotFoundException` | 404 Not Found |
| `UnauthorizedAccessException` | 401 Unauthorized |
| Any other | 500 Internal Server Error |

---

## Common Tasks

### Pull latest changes and update

```bash
git pull origin main
dotnet restore
dotnet ef database update
```

### Reset the database (destructive)

```bash
dotnet ef database drop
dotnet ef database update
```

### Add a new migration

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

---

## Troubleshooting

- **MySQL connection failed** — Make sure MySQL is running and the credentials in `appsettings.Development.json` are correct.
- **`dotnet ef` not found** — Run `dotnet tool install --global dotnet-ef`.
- **Migration errors** — Check that the Pomelo and EF Core package versions are compatible (they should match after `dotnet restore`).
- **.NET version mismatch** — Confirm `dotnet --version` returns `8.x.x`.
