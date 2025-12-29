#!/bin/bash
# Script to run database migrations in Docker container

echo "Running database migrations..."

# Check if container is running
if ! docker-compose ps | grep -q "codemart-api.*Up"; then
    echo "Error: API container is not running. Start it with: docker-compose up -d"
    exit 1
fi

# Run migrations
docker-compose exec api dotnet ef database update

echo "Migrations completed!"

