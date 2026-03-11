=============================
FotoPuzle Backend DB Setup Guide
=============================

This guide explains how to set up and run the FotoPuzle backend database locally

--------------------------------------------------
1. Prerequisites
--------------------------------------------------

1. .NET 8 SDK
   - Download: https://dotnet.microsoft.com/download/dotnet/8.0
   - Verify installation:
     > dotnet --version
     Should output a version like 8.x.x

2. MySQL Server
   - Download: https://dev.mysql.com/downloads/mysql/
   - Make sure you know your username and password (default is root).

3. MySQL Workbench or phpMyAdmin
   - Optional, for visually managing the database.

--------------------------------------------------
2. Clone the Repository
--------------------------------------------------

Open a terminal (Git Bash, PowerShell, or CMD) and run:

> git clone https://github.com/Krushis/foto-puzle.git
> cd foto-puzle/foto-puzle/backend/FotoPuzleBackend/FotoPuzleBackend

--------------------------------------------------
3. Configure the Database Connection
--------------------------------------------------

Edit `appsettings.Development.json` (it is shown when clicked the little arrow on the appsettings.json file) with:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=YOUR_DB_NAME;User=root;Password=YOUR_PASSWORD;"
  }
}

- Replace YOUR_PASSWORD with your MySQL password.
- Will need to make the name of your newly created Schema match the YOUR_DB_NAME
- Server `localhost` is correct if MySQL runs locally.

NOTE: `appsettings.Development.json` is ignored in Git to prevent sharing passwords.

--------------------------------------------------
4. Restore .NET Packages
--------------------------------------------------

Run:

> dotnet restore

This downloads all required packages (EF Core, Pomelo MySQL provider, OpenAPI tools, etc.).

--------------------------------------------------
5. Build the Project
--------------------------------------------------

Run:

> dotnet build

- Ensures the project compiles correctly before applying migrations.

--------------------------------------------------
6. Migrations & Database Setup
--------------------------------------------------

Check migrations:

> dotnet ef migrations list

You should see:

> InitialCreate

Apply migrations to the database:

> dotnet ef database update

This will:

- Create the `fotopuzle` database in MySQL.
- Create tables: Users, Photos, Puzzles.
- Create `__EFMigrationsHistory` table to track migrations.

Verify in MySQL Workbench or phpMyAdmin that the tables exist.

DB should be good to go and running! Ask Lukas if something doesnt work since I dont know if it will work :DDD, we will learn together

--------------------------------------------------
7. Some basic tips
--------------------------------------------------

1. When pulling latest changes:

> git pull origin main
> dotnet restore - to update dependencies
> dotnet ef database update - to update the database if migrations changed

2. To reset the database (destructive):

> dotnet ef database drop
> dotnet ef database update

3. Troubleshooting:
   - Make sure MySQL is running and the connection string matches your credentials.
   - Ensure .NET SDK version is 8.x.
   - If migrations fail, check that Pomelo and EF Core versions are compatible.

--------------------------------------------------
End of Guide
--------------------------------------------------