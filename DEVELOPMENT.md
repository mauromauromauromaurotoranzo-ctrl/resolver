# 🛠️ Guía de Desarrollo Local - Resolver.tech

Esta guía te ayuda a configurar el entorno de desarrollo local para trabajar en el proyecto.

## 📋 Requisitos Previos

- **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
- **Git**
- **OpenRouter API Key** (obligatorio para el chatbot)
  - Obtener en: https://openrouter.ai/keys

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git
cd resolver
```

### 2. Configurar variables de entorno

El archivo `.env` ya está creado con valores de desarrollo. Solo necesitas agregar tu API key:

```bash
# Editar .env y cambiar esta línea:
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key-here
```

### 3. Iniciar el entorno de desarrollo

#### Linux / macOS
```bash
./scripts/dev.sh
```

#### Windows (PowerShell)
```powershell
.\scripts\dev.ps1
```

#### Windows (CMD/Batch)
```cmd
scripts\dev.bat
```

---

## 🌐 Servicios Disponibles

Una vez iniciado, tendrás acceso a:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Landing Page | http://localhost:3000 | Página principal de marketing |
| Backoffice | http://localhost:3001 | Panel de administración |
| API | http://localhost:8000 | Backend Laravel + documentación API |
| Database | localhost:5432 | PostgreSQL (usuario: resolver_user) |

---

## 📁 Estructura del Proyecto

```
resolver/
├── apps/
│   ├── api/              # Backend Laravel (PHP)
│   │   ├── app/          # Lógica de la aplicación
│   │   ├── routes/       # Definición de rutas API
│   │   └── database/     # Migraciones y seeders
│   │
│   ├── chatbot-widget/   # Widget embebible (React)
│   │   └── src/
│   │       ├── components/  # Componentes UI
│   │       └── hooks/       # Lógica del chat
│   │
│   ├── landing/          # Landing page (Next.js)
│   │   └── app/
│   │       └── page.tsx  # Página principal
│   │
│   └── backoffice/       # Panel admin (React + Vite)
│       └── src/
│           ├── pages/    # Dashboard, Leads, Config
│           └── stores/   # Estado con Zustand
│
├── scripts/              # Scripts de automatización
│   ├── dev.sh            # Iniciar desarrollo (Linux/Mac)
│   ├── dev.ps1           # Iniciar desarrollo (Windows PS)
│   ├── dev.bat           # Iniciar desarrollo (Windows CMD)
│   ├── deploy.sh         # Desplegar a producción
│   └── backup.sh         # Backup de base de datos
│
├── docker-compose.dev.yml    # Configuración Docker para dev
├── docker-compose.yml        # Configuración Docker para prod
└── .env                      # Variables de entorno (ya configurado)
```

---

## 🔧 Comandos Útiles

### Ver logs de todos los servicios
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f landing
docker-compose -f docker-compose.dev.yml logs -f backoffice
```

### Reiniciar un servicio
```bash
docker-compose -f docker-compose.dev.yml restart api
docker-compose -f docker-compose.dev.yml restart landing
```

### Ejecutar comandos en contenedores

**Backend (Laravel):**
```bash
# Artisan commands
docker-compose -f docker-compose.dev.yml exec api php artisan migrate
docker-compose -f docker-compose.dev.yml exec api php artisan db:seed
docker-compose -f docker-compose.dev.yml exec api php artisan cache:clear

# Instalar dependencias PHP
docker-compose -f docker-compose.dev.yml exec api composer install
```

**Frontend (Landing/Backoffice):**
```bash
# Instalar dependencias npm
docker-compose -f docker-compose.dev.yml exec landing npm install
docker-compose -f docker-compose.dev.yml exec backoffice npm install
```

### Detener todos los servicios
```bash
docker-compose -f docker-compose.dev.yml down
```

### Eliminar todo (incluyendo datos de DB)
```bash
docker-compose -f docker-compose.dev.yml down -v
```

---

## 💻 Desarrollo sin Docker (Alternativa)

Si prefieres no usar Docker, puedes ejecutar cada servicio manualmente:

### Requisitos
- PHP 8.3+ con extensiones pgsql, mbstring, xml, curl
- Composer
- PostgreSQL 16
- Node.js 20+

### Backend (API)
```bash
cd apps/api
cp .env.example .env
# Editar .env con configuración local

composer install
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```

### Landing Page
```bash
cd apps/landing
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
npm run dev
```

### Backoffice
```bash
cd apps/backoffice
npm install
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local
npm run dev
```

---

## 🧪 Testing

### Ejecutar tests del backend
```bash
docker-compose -f docker-compose.dev.yml exec api php artisan test
```

### Resetear base de datos
```bash
docker-compose -f docker-compose.dev.yml exec api php artisan migrate:fresh --seed
```

---

## 🐛 Solución de Problemas

### Error: "Port already in use"
Algún puerto puede estar ocupado por otro servicio:

```bash
# Linux/Mac - ver qué usa el puerto
lsof -i :3000
lsof -i :8000

# Matar proceso
kill -9 <PID>
```

```powershell
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Cannot connect to database"
Esperar unos segundos más a que PostgreSQL esté listo, luego reiniciar:
```bash
docker-compose -f docker-compose.dev.yml restart api
```

### Cambios no se reflejan
Los contenedores de frontend tienen hot-reload. Si no funciona:
```bash
docker-compose -f docker-compose.dev.yml restart landing
docker-compose -f docker-compose.dev.yml restart backoffice
```

### Permisos en Windows con WSL2
Si usas WSL2 y hay problemas de permisos:
```bash
sudo chown -R $USER:$USER .
```

---

## 📚 Documentación Adicional

- `DEPLOY.md` - Guía de despliegue a producción
- `CUSTOM_DEV/CHATBOT/PRD.md` - Requisitos del producto
- `CUSTOM_DEV/CHATBOT/TECH_SPEC.md` - Especificación técnica

---

## 🤝 Contribuir

1. Crear una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commit de tus cambios: `git commit -m "Add: nueva funcionalidad"`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

---

## 💡 Tips

- **Hot reload**: Los cambios en código se reflejan automáticamente
- **Logs en tiempo real**: Usa `docker-compose logs -f` para ver errores
- **Base de datos**: Se persiste entre reinicios gracias al volumen Docker
- **API Key**: Sin OPENROUTER_API_KEY el chatbot no funcionará

---

¿Problemas? Revisa los logs con `docker-compose -f docker-compose.dev.yml logs -f` 🚀
