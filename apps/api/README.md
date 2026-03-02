# Resolver API

Backend Laravel para el sistema de chatbot de pre-venta.

## Setup

```bash
# Requisitos: PHP 8.3+, Composer, PostgreSQL

# 1. Crear proyecto Laravel
cd apps/api
composer create-project laravel/laravel . --prefer-dist

# 2. Instalar dependencias adicionales
composer require laravel/sanctum
composer require barryvdh/laravel-dompdf
composer require guzzlehttp/guzzle

# 3. Configurar .env
cp .env.example .env
php artisan key:generate

# 4. Configurar base de datos en .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=resolver_chatbot
DB_USERNAME=your_username
DB_PASSWORD=your_password

# 5. Ejecutar migraciones
php artisan migrate

# 6. Iniciar servidor
php artisan serve
```

## Estructura de Directorios

```
api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── ChatController.php
│   │           ├── LeadController.php
│   │           └── AdminController.php
│   ├── Models/
│   │   ├── ChatSession.php
│   │   ├── ChatMessage.php
│   │   ├── Lead.php
│   │   └── BotConfiguration.php
│   ├── Services/
│   │   ├── LLMService.php
│   │   ├── EstimatorService.php
│   │   ├── LeadQualificationService.php
│   │   └── PDFGeneratorService.php
│   └── ...
├── database/
│   └── migrations/
├── routes/
│   └── api.php
└── ...
```

## Endpoints API

Ver documentación completa en `TECH_SPEC.md` (raíz del proyecto chatbot).

## Comandos Útiles

```bash
# Crear migración
php artisan make:migration create_chat_sessions_table

# Crear modelo
php artisan make:model ChatSession

# Crear controlador
php artisan make:controller Api/ChatController

# Crear servicio (manual)
# app/Services/NombreService.php
```
