@echo off
chcp 65001 >nul
echo 🚀 Resolver.tech Development Environment
echo.

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%.."

REM Change to project directory
cd /d "%PROJECT_DIR%"

echo 📂 Working directory: %CD%
echo.

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo ✅ Created .env from .env.example
    ) else (
        echo ❌ Error: .env.example not found in %CD%
        pause
        exit /b 1
    )
    echo ⚠️  Please edit .env and add your OPENROUTER_API_KEY
    echo.
)

echo 📦 Starting services with Docker Compose...
docker-compose -f docker-compose.dev.yml up -d postgres
if errorlevel 1 (
    echo ❌ Error starting PostgreSQL. Is Docker running?
    pause
    exit /b 1
)

echo ⏳ Waiting for database (5 seconds)...
timeout /t 5 /nobreak >nul

echo 🔧 Setting up backend...
if not exist "apps\api\.env" (
    if exist "apps\api\.env.example" (
        copy apps\api\.env.example apps\api\.env
        echo ✅ Created apps/api/.env
    )
)

echo Installing PHP dependencies...
docker-compose -f docker-compose.dev.yml run --rm api composer install
if errorlevel 1 (
    echo ❌ Error installing PHP dependencies
    pause
    exit /b 1
)

echo Generating application key...
docker-compose -f docker-compose.dev.yml run --rm api php artisan key:generate --force 2>nul

echo Running database migrations...
docker-compose -f docker-compose.dev.yml run --rm api php artisan migrate --force
if errorlevel 1 (
    echo ❌ Error running migrations
    pause
    exit /b 1
)

echo 🚀 Starting all services...
docker-compose -f docker-compose.dev.yml up -d
if errorlevel 1 (
    echo ❌ Error starting services
    pause
    exit /b 1
)

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
