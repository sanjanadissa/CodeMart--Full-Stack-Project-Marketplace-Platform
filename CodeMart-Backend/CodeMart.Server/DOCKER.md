# Docker Setup Guide for CodeMart.Server

This guide explains how to run the CodeMart.Server application using Docker.

## Prerequisites

- Docker Desktop installed (or Docker Engine + Docker Compose)
- Docker version 20.10 or higher
- Docker Compose version 2.0 or higher

## Quick Start

### Option 1: Using Docker Compose (Recommended)

This will start the API service (database is hosted on Supabase):

```bash
# Build and start the API service
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop the service
docker-compose down
```

**Note:** This setup uses Supabase for the database. Make sure your `.env` file contains the `DB_CONNECTION_STRING` pointing to your Supabase instance.

### Option 2: Using Docker Only (Standalone)

```bash
# Build the image
docker build -t codemart-server .

# Run the container
docker run -d \
  --name codemart-api \
  -p 8080:8080 \
  -e DB_CONNECTION_STRING="Host=your-db-host;Port=5432;Database=codemart;Username=postgres;Password=your-password" \
  -e Jwt__Key="YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong" \
  -e Jwt__Issuer="CodeMart.Server" \
  -e Jwt__Audience="CodeMart.Client" \
  codemart-server
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Database Connection (REQUIRED)
DB_CONNECTION_STRING=Host=db.your-project-id.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require;Trust Server Certificate=true

# JWT Configuration (REQUIRED)
JWT_KEY=YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForHS256Algorithm
JWT_ISSUER=CodeMart.Server
JWT_AUDIENCE=CodeMart.Client
JWT_ACCESS_TOKEN_EXPIRATION_MINUTES=60

# Supabase Configuration (REQUIRED)
SUPABASE_PROJECT_URL=https://your-project-id.supabase.co
SUPABASE_API_KEY=your-supabase-api-key
```

**Important:** The `DB_CONNECTION_STRING` must point to your Supabase database. Get this from your Supabase project settings under Database → Connection string.

## Configuration

### Database Connection

The application will automatically run migrations on startup in Development mode. For Production, you may want to run migrations manually:

```bash
# Run migrations manually
docker-compose exec api dotnet ef database update
```

### Ports

- **API**: `http://localhost:8080` (HTTP)
- **API**: `https://localhost:8081` (HTTPS - if configured)
- **Database**: Hosted on Supabase (configured via `DB_CONNECTION_STRING`)

### Changing Ports

Edit `docker-compose.yml` to change ports:

```yaml
ports:
  - "5000:8080" # Change 5000 to your desired port
```

## Development

For development with hot-reload, use the override file:

```bash
# This uses docker-compose.override.yml automatically
docker-compose up
```

## Production Deployment

### 1. Build for Production

```bash
docker build -t codemart-server:latest .
```

### 2. Run with Production Settings

```bash
docker run -d \
  --name codemart-api \
  -p 8080:8080 \
  --env-file .env.production \
  --restart unless-stopped \
  codemart-server:latest
```

### 3. Using Docker Compose for Production

```bash
# Use production compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Health Checks

Check if the API is running:

```bash
# Check container status
docker ps

# Check API health
curl http://localhost:8080/api/health

# View API logs
docker-compose logs -f api
```

## Troubleshooting

### Database Connection Issues

1. Verify your Supabase database is accessible:

   - Check your Supabase project dashboard
   - Ensure the database is not paused
   - Verify your connection string is correct

2. Check API logs for connection errors:

   ```bash
   docker-compose logs api
   ```

3. Verify connection string in `.env` file:
   - Ensure `DB_CONNECTION_STRING` is set correctly
   - Format: `Host=db.your-project.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require;Trust Server Certificate=true`
   - Get the connection string from Supabase Dashboard → Settings → Database

### Migration Issues

If migrations fail, run them manually:

```bash
docker-compose exec api dotnet ef database update
```

### Port Already in Use

Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8081:8080" # Use different host port
```

### View Logs

```bash
# All services
docker-compose logs -f

# API service only
docker-compose logs -f api
```

## Clean Up

```bash
# Stop containers
docker-compose down

# Remove containers (no volumes needed since database is on Supabase)
docker-compose down

# Remove images
docker rmi codemart-server
```

## Security Notes

1. **Never commit `.env` files** with real credentials
2. **Use strong JWT keys** in production (at least 32 characters)
3. **Protect your Supabase credentials** - keep them secure and rotate passwords regularly
4. **Use HTTPS** in production (configure in `Program.cs`)
5. **Limit exposed ports** to only what's necessary
6. **Use Supabase connection pooling** for better performance and security

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [ASP.NET Core Docker Documentation](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/)
