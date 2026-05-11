# FotoPuzle — Database Setup

This guide covers creating the MySQL database and keeping it in sync with Entity Framework Core migrations.

---

## Prerequisites

- MySQL Server 8.x running locally
- .NET 8 SDK installed
- EF Core CLI: `dotnet tool install --global dotnet-ef`
- Backend connection string configured in `appsettings.Development.json` (see [Backend README](README.md))

---

## First-Time Setup

### 1. Create the schema in MySQL

Open MySQL Workbench, phpMyAdmin, or the MySQL CLI and create a new schema:

```sql
CREATE DATABASE fotopuzle;
```

Use that schema name as `YOUR_DB_NAME` in your connection string.

### 2. Check available migrations

```bash
dotnet ef migrations list
```

Expected output:

```
InitialCreate
```

### 3. Apply migrations

```bash
dotnet ef database update
```

This creates all tables in your MySQL schema and adds the `__EFMigrationsHistory` tracking table.

### 4. Verify

Open MySQL Workbench / phpMyAdmin and confirm these tables exist:

- `Users`
- `Photos`
- `Puzzles`
- `Orders`
- `CompletionTokens`
- `__EFMigrationsHistory`

---

## Database Schema Overview

```
Users
 ├── Photos        (UserId → Users.Id)
 ├── Puzzles       (UserId → Users.Id, PhotoId → Photos.Id)
 ├── Orders        (UserId → Users.Id, PuzzleId → Puzzles.Id)
 └── CompletionTokens (UserId → Users.Id, PuzzleId → Puzzles.Id)
```

---

## Day-to-Day Operations

### Pull latest changes (migrations may have been added)

```bash
git pull origin main
dotnet restore
dotnet ef migrations list   # check for new migrations
dotnet ef database update   # apply them
```

### Add a new migration (after changing entity classes)

```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

### Reset the database completely (destructive ⚠️)

```bash
dotnet ef database drop     # deletes everything
dotnet ef database update   # recreates from scratch
```

---

## Connection String Reference

Located in `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=fotopuzle;User=root;Password=YOUR_PASSWORD;"
  }
}
```

This file is Git-ignored — each developer maintains their own local copy with their own credentials.

---

## Troubleshooting

**Tables not created after `database update`**
Confirm the connection string points to the correct schema and that MySQL is running.

**Migration already applied error**
The migration is already in `__EFMigrationsHistory`. No action needed — `database update` is idempotent.

**Pomelo / EF Core version conflict**
Run `dotnet restore` to ensure package versions are in sync, then retry.

**Lost the database password**
Reset your MySQL root password, then update `appsettings.Development.json` accordingly.
