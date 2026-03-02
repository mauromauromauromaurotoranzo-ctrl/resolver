# Resolver.tech Development Script for Windows
# Usage: .\scripts\dev.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting development environment..." -ForegroundColor Cyan

# Check if .env exists, if not create from example
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit .env and add your OPENROUTER_API_KEY" -ForegroundColor Yellow
}

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]*)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Check for required env vars
$apiKey = $env:OPENROUTER_API_KEY
if ([string]::IsNullOrEmpty($apiKey) -or $apiKey -eq "sk-or-v1-your-openrouter-api-key-here") {
    Write-Host "⚠️  WARNING: OPENROUTER_API_KEY not set in .env" -ForegroundColor Yellow
    Write-Host "The chatbot won't work without a valid API key." -ForegroundColor Yellow
    Write-Host "Get one at: https://openrouter.ai/keys" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "📦 Starting services with Docker Compose..." -ForegroundColor Blue
docker-compose -f docker-compose.dev.yml up -d postgres

# Wait for database
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Setup backend if needed
Write-Host "🔧 Setting up backend..." -ForegroundColor Blue
if (-not (Test-Path "apps/api/.env")) {
    Copy-Item "apps/api/.env.example" "apps/api/.env"
}

# Install dependencies and run migrations
Write-Host "Installing PHP dependencies..." -ForegroundColor Gray
docker-compose -f docker-compose.dev.yml run --rm api composer install

try {
    docker-compose -f docker-compose.dev.yml run --rm api php artisan key:generate --force 2>$null
} catch {}

Write-Host "Running database migrations..." -ForegroundColor Gray
docker-compose -f docker-compose.dev.yml run --rm api php artisan migrate --force

Write-Host "🚀 Starting all services..." -ForegroundColor Blue
docker-compose -f docker-compose.dev.yml up -d

Write-Host ""
Write-Host "✅ Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Services available at:" -ForegroundColor Green
Write-Host "  🌐 Landing Page: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  🔧 Backoffice:   http://localhost:3001" -ForegroundColor Cyan
Write-Host "  ⚙️  API:         http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:     docker-compose -f docker-compose.dev.yml logs -f"
Write-Host "  Stop services: docker-compose -f docker-compose.dev.yml down"
Write-Host "  Restart API:   docker-compose -f docker-compose.dev.yml restart api"
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Yellow
