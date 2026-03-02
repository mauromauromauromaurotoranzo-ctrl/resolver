#!/bin/bash

# Resolver.tech Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-staging}
echo "🚀 Deploying to $ENVIRONMENT..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

echo -e "${YELLOW}📦 Building Docker images...${NC}"
docker-compose build --no-cache

echo -e "${YELLOW}🗄️ Starting database...${NC}"
docker-compose up -d postgres

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database...${NC}"
sleep 10

# Run migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
docker-compose run --rm api php artisan migrate --force

# Seed initial data (only for first deployment)
if [ "$ENVIRONMENT" = "production" ] && [ -z "$SKIP_SEED" ]; then
    read -p "Run database seeders? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose run --rm api php artisan db:seed --force
    fi
fi

# Start all services
echo -e "${YELLOW}🚀 Starting all services...${NC}"
docker-compose up -d

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Services available at:"
echo "  🌐 Landing Page: http://localhost:3000"
echo "  🔧 Backoffice:   http://localhost:3001"
echo "  ⚙️  API:         http://localhost:8000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
