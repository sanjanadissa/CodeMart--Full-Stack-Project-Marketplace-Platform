# Docker Setup Guide for CodeMart

This guide explains how to dockerize and run the entire CodeMart application.

## 📦 Architecture

The application consists of:

- **Frontend**: React + Vite (served via Nginx)
- **Backend**: ASP.NET Core API
- **Database**: Supabase (PostgreSQL hosted in the cloud)

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed
- Docker Compose installed (comes with Docker Desktop)

### 1. Production Setup (All Services in Docker)

```bash
# Create .env file in root directory
cp .env.example .env
# Edit .env with your configuration

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

**Services will be available at:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: Supabase (cloud-hosted)

### 2. Development Setup (Backend in Docker, Frontend Local)

```bash
# Start backend only (database is on Supabase)
docker-compose -f docker-compose.dev.yml up -d

# Run frontend locally
cd CodeMart-Frontend
npm install
npm run dev
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Database Connection String
# Get this from your Supabase project settings > Database > Connection string
# Format options:
# 1. URI format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
# 2. Standard format: Host=db.[project-ref].supabase.co;Port=5432;Database=postgres;Username=postgres;Password=[password]
DB_CONNECTION_STRING=postgresql://postgres.xxxxx:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# JWT Configuration
JWT_KEY=YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForHS256Algorithm
JWT_ISSUER=CodeMart.Server
JWT_AUDIENCE=CodeMart.Client
JWT_ACCESS_TOKEN_EXPIRATION_MINUTES=60

# Supabase
SUPABASE_PROJECT_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_api_key

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🏗️ Docker Files Structure

```
.
├── docker-compose.yml          # Production setup (all services)
├── docker-compose.dev.yml      # Development setup (DB + API only)
├── .dockerignore              # Files to exclude from Docker builds
├── CodeMart.Server/
│   ├── Dockerfile             # Backend Docker image
│   └── docker-compose.yml      # Backend-only compose (legacy)
└── CodeMart-Frontend/
    ├── Dockerfile             # Frontend Docker image
    ├── nginx.conf             # Nginx configuration
    └── .dockerignore          # Frontend-specific ignore
```

## 🔧 Building Individual Services

### Build Backend Only

```bash
cd CodeMart.Server
docker build -t codemart-api .
docker run -p 8080:8080 codemart-api
```

### Build Frontend Only

```bash
cd CodeMart-Frontend
docker build -t codemart-frontend .
docker run -p 3000:80 codemart-frontend
```

## 📊 Service Details

### Getting Supabase Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **Database**
3. Find **Connection string** section
4. Choose **Connection pooling** (recommended for production) or **Direct connection**
5. Copy the connection string and add it to your `.env` file as `DB_CONNECTION_STRING`

**Connection Pooling (Recommended):**

- Port: `6543`
- Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

**Direct Connection:**

- Port: `5432`
- Format: `Host=db.[project-ref].supabase.co;Port=5432;Database=postgres;Username=postgres;Password=[password]`

### Frontend (Nginx)

- **Port**: 3000 (mapped to container port 80)
- **Build**: Multi-stage build (Node.js build → Nginx serve)
- **Features**:
  - SPA routing support
  - API proxy to backend
  - Gzip compression
  - Static asset caching

### Backend (ASP.NET Core)

- **Ports**: 8080 (HTTP), 8081 (HTTPS)
- **Build**: Multi-stage build (.NET SDK → Runtime)
- **Features**:
  - Health checks
  - Database migrations on startup
  - Environment-based configuration

### Database (Supabase)

- **Hosting**: Cloud-hosted PostgreSQL
- **Connection**: Via connection string from Supabase dashboard
- **No local container needed**: Database is managed by Supabase

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux

# Change port in docker-compose.yml
ports:
  - "8081:8080"  # Use different host port
```

### Database Connection Issues

```bash
# Verify Supabase connection string is correct
# Check your .env file has the correct DB_CONNECTION_STRING

# Test connection from Supabase dashboard
# Go to: Supabase Dashboard > Database > Connection Pooling

# Common issues:
# - Wrong connection string format
# - Incorrect password
# - Network/firewall blocking connection
# - Using transaction pooler port (6543) vs direct connection (5432)
```

### Frontend Can't Connect to Backend

- Ensure both services are on the same Docker network
- Check CORS configuration in backend
- Verify API URL in frontend environment variables

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose build frontend
docker-compose up -d frontend

# Rebuild all services
docker-compose build
docker-compose up -d
```

### Clear Everything and Start Fresh

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## 🔒 Security Considerations

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong passwords** - Especially for database and JWT keys
3. **Update default JWT_KEY** - Generate a secure random key
4. **Limit CORS origins** - Only allow trusted domains
5. **Use secrets management** - For production, use Docker secrets or external secret managers

## 📈 Production Deployment

For production deployment:

1. **Use environment-specific compose files**

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Set up reverse proxy** (Nginx/Traefik) for SSL termination

3. **Database is already managed** - Using Supabase (cloud-hosted PostgreSQL)

4. **Enable health checks** and monitoring

5. **Set up log aggregation** (ELK, CloudWatch, etc.)

6. **Use container orchestration** (Kubernetes, Docker Swarm) for scaling

## 🧪 Testing

```bash
# Test backend health
curl http://localhost:8080/health

# Test frontend
curl http://localhost:3000

# Test API endpoint
curl http://localhost:8080/api/project/projects
```

## 📚 Additional Commands

```bash
# View running containers
docker-compose ps

# View logs for specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f postgres

# Execute command in container
docker-compose exec api dotnet ef migrations list
docker-compose exec postgres psql -U codemart

# Scale services (if needed)
docker-compose up -d --scale api=3  # Run 3 API instances

# View resource usage
docker stats
```

## 🎯 Next Steps

1. Set up CI/CD pipeline
2. Configure monitoring and logging
3. Set up backup strategy for database
4. Implement health check endpoints
5. Configure SSL/TLS certificates
6. Set up load balancing for production
