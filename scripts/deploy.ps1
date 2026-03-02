# Resolver.tech Deployment Script for Windows (PowerShell)
# Usage: .\scripts\deploy.ps1 [environment]

param(
    [string]$Environment = "staging"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying to $Environment..." -ForegroundColor Cyan

# Colors
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found" -ForegroundColor $Red
    Write-Host "Please create a .env file based on .env.example"
    exit 1
}

# Load environment variables from .env
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]*)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

Write-Host "📦 Building Docker images..." -ForegroundColor $Yellow
docker-compose build --no-cache

Write-Host "🗄️ Starting database..." -ForegroundColor $Yellow
docker-compose up -d postgres

# Wait for database
Write-Host "⏳ Waiting for database..." -ForegroundColor $Yellow
Start-Sleep -Seconds 10

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor $Yellow
docker-compose run --rm api php artisan migrate --force

# Seed data (optional for production)
if ($Environment -eq "production" -and -not $env:SKIP_SEED) {
    $response = Read-Host "Run database seeders? (y/N)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        docker-compose run --rm api php artisan db:seed --force
    }
}

# Start all services
Write-Host "🚀 Starting all services..." -ForegroundColor $Yellow
docker-compose up -d

Write-Host "✅ Deployment complete!" -ForegroundColor $Green
Write-Host ""
Write-Host "Services available at:"
Write-Host "  🌐 Landing Page: http://localhost:3000"
Write-Host "  🔧 Backoffice:   http://localhost:3001"
Write-Host "  ⚙️  API:         http://localhost:8000"
Write-Host ""
Write-Host "To view logs: docker-compose logs -f"
Write-Host "To stop:      docker-compose down"
