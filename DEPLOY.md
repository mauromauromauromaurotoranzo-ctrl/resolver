# 🚀 Guía de Despliegue - Resolver.tech Chatbot

## 📋 Requisitos Previos

### Linux / macOS
- Servidor con Ubuntu 22.04 LTS (o similar)
- PHP 8.3+ con extensiones: pgsql, mbstring, xml, curl, zip, bcmath
- PostgreSQL 16+
- Node.js 20+
- Nginx o Apache
- Certbot (para SSL)
- Git

### Windows
- Windows 10/11 Pro o Enterprise
- Docker Desktop para Windows
- WSL2 (Windows Subsystem for Linux) - Opcional pero recomendado
- Git para Windows
- PowerShell 5.1+ o PowerShell Core 7+

---

## 🚀 Despliegue Rápido

### Opción 1: Docker Compose (Recomendado para todos los sistemas)

#### Linux / macOS
```bash
# 1. Clonar repositorio
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git
cd resolver

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Ejecutar script de despliegue
./scripts/deploy.sh production
```

#### Windows (PowerShell) ⭐ Recomendado
```powershell
# 1. Clonar repositorio
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git
cd resolver

# 2. Configurar variables de entorno
copy .env.example .env
# Editar .env con Notepad, VS Code, etc.

# 3. Ejecutar script de despliegue
.\scripts\deploy.ps1 production
```

#### Windows (CMD/Batch) - Alternativa simple
```cmd
# 1. Clonar y navegar
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git
cd resolver

# 2. Copiar archivo de configuración
copy .env.example .env

# 3. Ejecutar batch file
scripts\deploy.bat
```

#### Windows con WSL2 (Mejor rendimiento)
```bash
# Abrir WSL2 terminal (Ubuntu)
cd /mnt/c/Users/TuUsuario/proyectos  # O tu directorio preferido

# Clonar y desplegar
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git
cd resolver
cp .env.example .env
nano .env  # Editar variables

# Ejecutar con script Linux
./scripts/deploy.sh production
```

---

## 🪟 Guía Específica para Windows

### Método 1: Docker Desktop + PowerShell (Más fácil)

#### Paso 1: Instalar prerequisitos
1. Descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Habilitar integración con WSL2 durante la instalación
3. Instalar [Git para Windows](https://git-scm.com/download/win)

#### Paso 2: Configurar proyecto
```powershell
# Abrir PowerShell como Administrador
# Navegar al directorio donde quieras el proyecto
cd C:\Proyectos

# Clonar repositorio
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git
cd resolver

# Crear archivo de configuración
copy .env.example .env

# Editar .env con tus valores (usando Notepad o VS Code)
notepad .env
```

**Variables mínimas a configurar en .env:**
```env
DB_PASSWORD=tu_password_seguro_aqui
OPENROUTER_API_KEY=sk-or-v1-tu-api-key
JWT_SECRET=generar_una_clave_larga_y_segura
```

#### Paso 3: Ejecutar despliegue
```powershell
# Ejecutar script PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\deploy.ps1

# O usar el batch file más simple
scripts\deploy.bat
```

#### Paso 4: Acceder a los servicios
- Landing Page: http://localhost:3000
- Backoffice: http://localhost:3001
- API: http://localhost:8000

---

### Método 2: WSL2 (Recomendado para desarrollo)

#### Paso 1: Instalar WSL2
```powershell
# En PowerShell como Administrador
wsl --install
# Reiniciar computadora
```

#### Paso 2: Configurar Ubuntu en WSL2
```bash
# Abrir Ubuntu desde el menú Inicio
sudo apt update && sudo apt upgrade -y

# Instalar Docker dentro de WSL2
sudo apt install docker.io docker-compose -y

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Cerrar y volver a abrir terminal
```

#### Paso 3: Desplegar proyecto
```bash
# Navegar a tu directorio de proyectos de Windows
cd /mnt/c/Users/TuUsuario/Proyectos

# Clonar y desplegar
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git
cd resolver
cp .env.example .env
nano .env  # Editar configuración

# Desplegar
./scripts/deploy.sh production
```

---

### Método 3: Manual sin Docker (Avanzado)

Si prefieres no usar Docker en Windows, necesitas instalar cada componente manualmente:

#### 1. Instalar XAMPP o Laragon
- Descargar [XAMPP](https://www.apachefriends.org/) con PHP 8.3 y PostgreSQL
- O usar [Laragon](https://laragon.org/) (más fácil para Laravel)

#### 2. Instalar Node.js
- Descargar [Node.js 20 LTS](https://nodejs.org/)

#### 3. Configurar backend (Laravel)
```powershell
# En PowerShell
cd apps\api

# Copiar .env
copy .env.example .env

# Editar .env con configuración local
notepad .env

# Instalar dependencias PHP (requiere Composer)
composer install

# Generar key
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor de desarrollo
php artisan serve
```

#### 4. Configurar frontend (Landing)
```powershell
cd apps\landing
npm install
npm run dev
```

#### 5. Configurar backoffice
```powershell
cd apps\backoffice
npm install
npm run dev
```

---

## 🔧 Comandos Útiles por Sistema Operativo

### Ver logs

**Linux/macOS:**
```bash
docker-compose logs -f
docker-compose logs -f api
docker-compose logs -f landing
```

**Windows (PowerShell):**
```powershell
docker-compose logs -f
docker-compose logs -f api
docker-compose logs -f landing
```

**Windows (CMD):**
```cmd
docker-compose logs -f
docker-compose logs -f api
```

### Backup de base de datos

**Linux/macOS:**
```bash
./scripts/backup.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\backup.ps1
```

**Windows (Manual):**
```powershell
docker-compose exec postgres pg_dump -U resolver_user resolver_db > backup_$(Get-Date -Format 'yyyyMMdd').sql
```

### Detener servicios

**Todos los sistemas:**
```bash
docker-compose down
```

### Actualizar código

**Linux/macOS/WSL2:**
```bash
git pull origin main
./scripts/deploy.sh
```

**Windows (PowerShell):**
```powershell
git pull origin main
.\scripts\deploy.ps1
```

---

## ⚠️ Solución de Problemas en Windows

### Error: "docker-compose no se reconoce"
**Solución:** Docker Desktop no está instalado o no está en el PATH. Reiniciar después de instalar Docker Desktop.

### Error: "El ejecutable de scripts está deshabilitado"
**Solución:** Ejecutar en PowerShell como Administrador:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Puerto ya está en uso"
**Solución:** Algunos puertos pueden estar ocupados por otros servicios de Windows:
```powershell
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Matar proceso (reemplazar PID con el número que aparezca)
taskkill /PID <PID> /F
```

### Error de permisos en volúmenes Docker
**Solución:** En Windows, los permisos de archivos entre host y contenedor pueden causar problemas. Usar WSL2 es la mejor solución.

### Problemas con caracteres especiales
**Solución:** Asegurarse de guardar archivos .env con codificación UTF-8 sin BOM.

---

## 📁 Estructura de Archivos de Scripts

```
resolver/
├── scripts/
│   ├── deploy.sh          # Linux/macOS
│   ├── deploy.ps1         # Windows PowerShell ⭐
│   ├── deploy.bat         # Windows CMD (simple)
│   ├── backup.sh          # Linux/macOS
│   └── backup.ps1         # Windows PowerShell
└── ...
```

---

## ✅ Checklist Post-Despliegue (Todos los SO)

- [ ] Backend responde en `http://localhost:8000`
- [ ] Landing page carga en `http://localhost:3000`
- [ ] Backoffice accesible en `http://localhost:3001`
- [ ] Base de datos conectada (verificar en logs)
- [ ] Migraciones ejecutadas sin errores
- [ ] OpenRouter API key configurada
- [ ] Logs sin errores críticos
- [ ] Widget puede comunicarse con API

---

## 🌐 Para Producción con Dominios Reales

Cuando estés listo para producción con dominios propios:

### Opción A: VPS Cloud (DigitalOcean, AWS, Azure)
Seguir la guía detallada en secciones posteriores de este documento (configuración manual con Nginx).

### Opción B: Plataformas PaaS
- **Railway**, **Render**, **Fly.io**: Soportan despliegue directo desde GitHub
- Configurar variables de entorno en el dashboard de la plataforma
- Conectar repositorio y activar auto-deploy

---

## 📞 Soporte

Para problemas específicos:
1. Revisar logs: `docker-compose logs -f [servicio]`
2. Verificar variables de entorno en `.env`
3. Consultar documentación en `CUSTOM_DEV/CHATBOT/`
