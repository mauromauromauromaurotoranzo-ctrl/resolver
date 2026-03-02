#!/bin/bash

# Backup script for Resolver.tech
# Usage: ./scripts/backup.sh

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "💾 Creating backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database backup
echo "📦 Backing up database..."
docker-compose exec -T postgres pg_dump -U resolver_user resolver_db > "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Compress backup
gzip "$BACKUP_DIR/db_$TIMESTAMP.sql"

echo "✅ Backup created: $BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t *.gz | tail -n +8 | xargs rm -f 2>/dev/null || true

echo "🧹 Old backups cleaned up (keeping last 7)"
