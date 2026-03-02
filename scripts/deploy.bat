@echo off
chcp 65001 >nul
echo 🚀 Resolver.tech Deployment Script for Windows
echo.

REM Check if .env exists
if not exist ".env" (
    echo ❌ Error: .env file not found
    echo Please create a .env file based on .env.example
    exit /b 1
)

echo 📦 Building Docker images...
docker-compose build --no-cache

echo 🗄️ Starting database...
docker-compose up -d postgres

echo ⏳ Waiting for database (10 seconds)...
timeout /t 10 /nobreak >nul

echo 🔄 Running database migrations...
docker-compose run --rm api php artisan migrate --force

echo 🚀 Starting all services...
docker-compose up -d

echo.
echo ✅ Deployment complete!
echo.
echo Services available at:
echo   🌐 Landing Page: http://localhost:3000
echo   🔧 Backoffice:   http://localhost:3001
echo   ⚙️  API:         http://localhost:8000
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
pause
