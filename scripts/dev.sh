#!/bin/bash

# Resolver.tech Development Script
# Usage: ./scripts/dev.sh

set -e

echo "🚀 Starting development environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env and add your OPENROUTER_API_KEY${NC}"
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check for required env vars
if [ -z "$OPENROUTER_API_KEY" ] || [ "$OPENROUTER_API_KEY" = "sk-or-v1-your-openrouter-api-key-here" ]; then
    echo -e "${YELLOW}⚠️  WARNING: OPENROUTER_API_KEY not set in .env${NC}"
    echo "The chatbot won't work without a valid API key."
    echo "Get one at: https://openrouter.ai/keys"
    echo ""
fi

echo -e "${BLUE}📦 Starting services with Docker Compose...${NC}"
docker-compose -f docker-compose.dev.yml up -d postgres

# Wait for database
echo -e "${BLUE}⏳ Waiting for database to be ready...${NC}"
sleep 5

# Setup backend if needed
echo -e "${BLUE}🔧 Setting up backend...${NC}"
if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
fi

# Install dependencies and run migrations
docker-compose -f docker-compose.dev.yml run --rm api composer install
docker-compose -f docker-compose.dev.yml run --rm api php artisan key:generate --force 2>/dev/null || true
docker-compose -f docker-compose.dev.yml run --rm api php artisan migrate --force

echo -e "${BLUE}🚀 Starting all services...${NC}"
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo -e "${GREEN}✅ Development environment is ready!${NC}"
echo ""
echo -e "${GREEN}Services available at:${NC}"
echo -e "  🌐 ${BLUE}Landing Page:${NC} http://localhost:3000"
echo -e "  🔧 ${BLUE}Backoffice:${NC}   http://localhost:3001"
echo -e "  ⚙️  ${BLUE}API:${NC}         http://localhost:8000"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs:     docker-compose -f docker-compose.dev.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.dev.yml down"
echo "  Restart API:   docker-compose -f docker-compose.dev.yml restart api"
echo ""
echo -e "${YELLOW}Happy coding! 🎉${NC}"
