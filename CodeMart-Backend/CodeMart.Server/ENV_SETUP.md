# Environment Variables Setup

All sensitive configuration has been moved from `appsettings.json` to environment variables for better security.

## Required Environment Variables

Create a `.env` file in the root of `CodeMart.Server` directory with the following variables:

```env
# Database Configuration (REQUIRED)
DB_CONNECTION_STRING=Host=db.vnbvroovvmoyksgujpnl.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=harinwadda123;SSL Mode=Require;Trust Server Certificate=true

# Supabase Configuration (REQUIRED)
SUPABASE_PROJECT_URL=https://db.vnbvroovvmoyksgujpnl.supabase.co
SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuYnZyb292dm1veWtzZ3VqcG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzc4NDEsImV4cCI6MjA3ODYxMzg0MX0.3uH8RpuZjmOJtI0IlujAUdOUtrko5-PfWcRvSqhY-q4

# JWT Configuration (REQUIRED)
JWT_KEY=u7F1K9r3zQp5S1v8N2a4E7xY6wG9mJ3pB0cT4fU6nH2bL8qR5dV7kY1zW3sP0tA
JWT_ISSUER=CodeMart.Server
JWT_AUDIENCE=CodeMart.Client
JWT_ACCESS_TOKEN_EXPIRATION_MINUTES=60
```

## Important Notes

1. **All marked (REQUIRED) variables must be set** - The application will throw an error if any are missing
2. **Never commit `.env` file** to version control - Add `.env` to `.gitignore`
3. The `.env` file is automatically loaded by `DotNetEnv` package (already configured in `Program.cs`)
4. For Docker, environment variables are set in `docker-compose.yml`

## Required Variables

- `DB_CONNECTION_STRING` - PostgreSQL database connection string
- `SUPABASE_PROJECT_URL` - Supabase project URL
- `SUPABASE_API_KEY` - Supabase API key
- `JWT_KEY` - Secret key for signing JWT tokens (at least 32 characters)

## Optional Variables (with defaults)

- `JWT_ISSUER`: Defaults to `"CodeMart.Server"` if not set
- `JWT_AUDIENCE`: Defaults to `"CodeMart.Client"` if not set
- `JWT_ACCESS_TOKEN_EXPIRATION_MINUTES`: Defaults to `60` if not set

## Creating Your .env File

1. Copy the example above
2. Replace `JWT_KEY` with a strong secret key (at least 32 characters)
3. Update other values as needed
4. Save as `.env` in the `CodeMart.Server` directory

## For Docker

Environment variables are already configured in `docker-compose.yml`. You can:

- Set them directly in `docker-compose.yml`
- Use a `.env` file (Docker Compose automatically loads it)
- Pass them via command line: `docker-compose up -e JWT_KEY=your-key`
