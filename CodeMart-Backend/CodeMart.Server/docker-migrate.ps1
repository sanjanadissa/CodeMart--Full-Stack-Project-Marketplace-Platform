# PowerShell script to run database migrations in Docker container

Write-Host "Running database migrations..." -ForegroundColor Cyan

# Check if container is running
$containerStatus = docker-compose ps | Select-String "codemart-api"
if (-not $containerStatus -or -not ($containerStatus -match "Up")) {
    Write-Host "Error: API container is not running. Start it with: docker-compose up -d" -ForegroundColor Red
    exit 1
}

# Run migrations
docker-compose exec api dotnet ef database update

Write-Host "Migrations completed!" -ForegroundColor Green

