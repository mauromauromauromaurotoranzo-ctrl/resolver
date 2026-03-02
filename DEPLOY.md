# 🚀 Guía de Despliegue - Resolver.tech Chatbot

## 📋 Requisitos Previos

- Servidor con Ubuntu 22.04 LTS (o similar)
- PHP 8.3+ con extensiones: pgsql, mbstring, xml, curl, zip, bcmath
- PostgreSQL 16+
- Node.js 20+
- Nginx o Apache
- Certbot (para SSL)
- Git

---

## 1️⃣ Backend API (Laravel)

### Preparación del Servidor

```bash
# Instalar dependencias
sudo apt update
sudo apt install -y php8.3-fpm php8.3-pgsql php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath
sudo apt install -y nginx postgresql redis composer

# Configurar PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE resolver_db;"
sudo -u postgres psql -c "CREATE USER resolver_user WITH PASSWORD 'tu_password_seguro';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE resolver_db TO resolver_user;"
```

### Despliegue

```bash
# Clonar repositorio
cd /var/www
git clone https://github.com/mauromauromauromaurotoranzo-ctrl/resolver.git

# Configurar backend
cd resolver/apps/api
cp .env.example .env

# Editar .env con tus valores:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=resolver_db
# DB_USERNAME=resolver_user
# DB_PASSWORD=tu_password_seguro
#
# OPENROUTER_API_KEY=tu_api_key_de_openrouter

# Instalar dependencias
composer install --no-dev --optimize-autoloader

# Generar key y ejecutar migraciones
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permisos
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data .
```

### Configuración Nginx

```nginx
server {
    listen 80;
    server_name api.resolver.tech;
    root /var/www/resolver/apps/api/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

---

## 2️⃣ Landing Page (Next.js)

### Build y Despliegue

```bash
cd /var/www/resolver/apps/landing

# Instalar dependencias
npm ci

# Crear archivo .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.resolver.tech/api/v1
NEXT_PUBLIC_WIDGET_URL=https://widget.resolver.tech
EOF

# Build para producción
npm run build

# Iniciar con PM2
npm install -g pm2
pm2 start npm --name "resolver-landing" -- start
pm2 save
pm2 startup
```

### Configuración Nginx (Proxy)

```nginx
server {
    listen 80;
    server_name resolver.tech www.resolver.tech;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 3️⃣ Chatbot Widget

### Build y Publicación

```bash
cd /var/www/resolver/apps/chatbot-widget

# Instalar dependencias
npm ci

# Crear archivo .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.resolver.tech/api/v1
EOF

# Build para producción
npm run build

# Los archivos estarán en dist/
# Copiar a directorio web o CDN
sudo cp -r dist/* /var/www/widget.resolver.tech/
```

### Uso del Widget (Script Tag)

```html
<!-- En tu HTML -->
<div id="resolver-chat"></div>
<script src="https://widget.resolver.tech/resolver-chat.umd.js"></script>
<script>
  window.ResolverChat.init({
    apiEndpoint: 'https://api.resolver.tech/api/v1',
    position: 'bottom-right',
    primaryColor: '#3b82f6'
  });
</script>
```

---

## 4️⃣ Backoffice Admin

### Build y Despliegue

```bash
cd /var/www/resolver/apps/backoffice

# Instalar dependencias
npm ci

# Crear archivo .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.resolver.tech/api/v1
EOF

# Build para producción
npm run build

# Iniciar con PM2 en puerto 3001
pm2 serve dist 3001 --name "resolver-backoffice"
pm2 save
```

### Configuración Nginx

```nginx
server {
    listen 80;
    server_name admin.resolver.tech;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5️⃣ SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificados
sudo certbot --nginx -d resolver.tech -d www.resolver.tech
sudo certbot --nginx -d api.resolver.tech
sudo certbot --nginx -d widget.resolver.tech
sudo certbot --nginx -d admin.resolver.tech

# Auto-renewal ya está configurado
```

---

## 6️⃣ Variables de Entorno Completas

### Backend (.env)

```env
APP_NAME=ResolverAPI
APP_ENV=production
APP_KEY=base64:generar_con_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://api.resolver.tech

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=resolver_db
DB_USERNAME=resolver_user
DB_PASSWORD=tu_password_seguro

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

OPENROUTER_API_KEY=sk-or-v1-tu-api-key-de-openrouter
```

---

## 7️⃣ Comandos Útiles

```bash
# Ver logs del backend
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/www/resolver/apps/api/storage/logs/laravel.log

# Reiniciar servicios
sudo systemctl restart nginx
sudo systemctl restart php8.3-fpm
sudo systemctl restart postgresql

# PM2 management
pm2 status
pm2 logs
pm2 restart all

# Actualizar código
cd /var/www/resolver
git pull origin main

# Actualizar backend
cd apps/api
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize

# Actualizar frontend
cd apps/landing && npm ci && npm run build && pm2 restart resolver-landing
cd apps/backoffice && npm ci && npm run build && pm2 restart resolver-backoffice
```

---

## 8️⃣ Checklist Post-Despliegue

- [ ] Backend responde en `https://api.resolver.tech`
- [ ] Landing page carga en `https://resolver.tech`
- [ ] Widget se carga desde `https://widget.resolver.tech`
- [ ] Backoffice accesible en `https://admin.resolver.tech`
- [ ] SSL certificates válidos
- [ ] Base de datos conectada
- [ ] Migraciones ejecutadas
- [ ] OpenRouter API key configurada
- [ ] Logs sin errores críticos
- [ ] Rate limiting funcionando
- [ ] CORS configurado correctamente

---

## 🔧 Troubleshooting

### Error 500 en API
```bash
# Ver permisos
sudo chown -R www-data:www-data /var/www/resolver/apps/api/storage
sudo chmod -R 775 /var/www/resolver/apps/api/storage

# Limpiar caches
php artisan cache:clear
php artisan config:clear
```

### CORS Errors
Verificar `config/cors.php` y agregar dominios permitidos.

### Widget no carga
Verificar que los archivos estén en el directorio correcto y accesibles vía HTTPS.

---

## 📞 Soporte

Para problemas específicos, revisar:
- Logs de Laravel: `storage/logs/`
- Logs de Nginx: `/var/log/nginx/`
- Logs de PM2: `pm2 logs`
