@echo off
chcp 65001 >nul
echo 🚀 Resolver.tech Development Environment
echo.

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your OPENROUTER_API_KEY
    echo.
)

echo 📦 Starting services with Docker Compose...
docker-compose -f docker-compose.dev.yml up -d postgres

echo ⏳ Waiting for database (5 seconds)...
timeout /t 5 /nobreak >nul

echo 🔧 Setting up backend...
if not exist "apps\api\.env" (
    copy apps\api\.env.example apps\api\.env
)

echo Installing PHP dependencies...
docker-compose -f docker-compose.dev.yml run --rm api composer install

echo Generating application key...
docker-compose -f docker-compose.dev.yml run --rm api php artisan key:generate --force 2>nul

echo Running database migrations...
docker-compose -f docker-compose.dev.yml run --rm api php artisan migrate --force

echo 🚀 Starting all services...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo ✅ Development environment is ready!
echo.
echo Services available at:
echo   🌐 Landing Page: http://localhost:3000
echo   🔧 Backoffice:   http://localhost:3001
echo   ⚙️  API:         http://localhost:8000
echo.
echo Useful commands:
echo   View logs:     docker-compose -f docker-compose.dev.yml logs -f
echo   Stop services: docker-compose -f docker-compose.dev.yml down
echo   Restart API:   docker-compose -f docker-compose.dev.yml restart api
echo.
echo Happy coding! 🎉
pause
