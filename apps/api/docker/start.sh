#!/bin/sh
set -e

echo "Waiting for database..."
sleep 5

echo "Running migrations..."
php artisan migrate --force

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting services..."
supervisord -c /etc/supervisor/conf.d/supervisord.conf
