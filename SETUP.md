# Quick Setup Guide

Follow these steps to get the Creator Onboarding Builder running from scratch.

## 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

## 2. Set Up Environment

Copy the example environment file:
```bash
cp .env.example .env
```

The default `.env` file uses SQLite for development, which requires no additional setup.

## 3. Initialize Database

```bash
# Generate Prisma client
pnpm prisma generate

# Create database and run migrations
pnpm prisma migrate dev --name init
```

This will:
- Create the SQLite database file (`dev.db`)
- Create all necessary tables
- Set up the schema

## 4. Start Development Server

```bash
pnpm dev
```

## 5. Access the Admin Dashboard

Open [http://localhost:3000/admin/onboarding](http://localhost:3000/admin/onboarding)

You should see the admin dashboard where you can:
- Customize theme and branding
- Add and edit steps
- Preview the onboarding
- Publish changes

## First Steps

1. **Customize Theme**: Go to the "Theme & Branding" tab and set your colors
2. **Add Steps**: Go to the "Steps" tab and click "+ Add Step"
3. **Preview**: Use the "Preview" tab to see how it looks
4. **Publish**: Click "Publish" to make it live

## Troubleshooting

### Database Issues

If you get database errors:
```bash
# Reset the database (WARNING: deletes all data)
pnpm prisma migrate reset

# Or manually delete and recreate
rm dev.db
pnpm prisma migrate dev --name init
```

### Prisma Client Not Found

If you see "PrismaClient not found" errors:
```bash
pnpm prisma generate
```

### Port Already in Use

If port 3000 is taken:
```bash
# Use a different port
pnpm dev -- -p 3001
```

## Production Setup

For production, you'll want to:

1. Use PostgreSQL or MySQL instead of SQLite
2. Set `DATABASE_URL` to your production database
3. Run `pnpm prisma migrate deploy` to apply migrations
4. Enable multi-tenancy (see `MULTI-TENANCY.md`)

