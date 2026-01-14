#!/bin/bash

# Setup script for Creator Onboarding Builder
# This script helps you get started from scratch

set -e

echo "🚀 Setting up Creator Onboarding Builder..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "✅ Created .env file"
else
  echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
  pnpm install
else
  echo "⚠️  pnpm not found, using npm..."
  npm install
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
if command -v pnpm &> /dev/null; then
  pnpm prisma generate
else
  npx prisma generate
fi

# Run migrations
echo ""
echo "🗄️  Setting up database..."
if command -v pnpm &> /dev/null; then
  pnpm prisma migrate dev --name init
else
  npx prisma migrate dev --name init
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  pnpm dev"
echo "  or"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000/admin/onboarding"

