# Creator Onboarding Builder

A customizable, multi-tenant onboarding builder that allows creators to build and publish their own onboarding flows for their Whop products. Built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

- 🎨 **Fully Customizable Theme**
  - Primary, secondary, and light colors
  - Custom gradients
  - Button styles (radius, variants)
  - Logo and cover image uploads
  - Light/dark mode support

- 📝 **Flexible Step System**
  - **Choice Steps**: Multiple choice selections
  - **Video Steps**: Embedded videos with watch tracking
  - **Tour Steps**: Interactive dashboard tours with video modals
  - **Form Steps**: Customizable form fields
  - **Checklist Steps**: Task lists with step numbers and highlights
  - **Finale Steps**: Completion screens with XP display

- 🎯 **Admin Dashboard**
  - Theme editor with live preview
  - Step builder with drag-and-drop reordering
  - Step editor for all step types
  - Live preview of onboarding flow
  - Draft/Published workflow

- 🎮 **Gamification**
  - XP points system
  - Progress tracking
  - Confetti celebrations
  - Step completion tracking

- 🔒 **Multi-Tenancy Ready**
  - Each creator has their own onboarding config
  - Ownership verification (can be enabled)
  - Scoped by Whop ID

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm/npm
- Database (SQLite for development, PostgreSQL/MySQL for production)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd whop-onboarding-all
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:
```env
DATABASE_URL="file:./dev.db"
```

4. **Set up the database**
```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations (creates database and tables)
pnpm prisma migrate dev --name init
```

5. **Start the development server**
```bash
pnpm dev
```

6. **Open the admin dashboard**
Navigate to [http://localhost:3000/admin/onboarding](http://localhost:3000/admin/onboarding)

## Project Structure

```
whop-onboarding-all/
├── app/
│   ├── admin/
│   │   └── onboarding/     # Admin dashboard
│   ├── api/
│   │   └── onboarding/     # API routes for CRUD operations
│   ├── onboarding/          # Buyer-facing onboarding pages
│   └── layout.tsx
├── components/
│   ├── admin/              # Admin dashboard components
│   └── onboarding/         # Onboarding step components
├── lib/
│   ├── auth/               # Authentication helpers
│   ├── db/                 # Database client
│   ├── onboarding/         # Onboarding service & types
│   └── theme/              # Theme provider
├── prisma/
│   └── schema.prisma       # Database schema
└── ...
```

## Database Setup

### Development (SQLite)

The default setup uses SQLite for easy local development:

```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL/MySQL)

For production, use PostgreSQL or MySQL:

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/onboarding?schema=public"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/onboarding"
```

Then run migrations:
```bash
pnpm prisma migrate deploy
```

## Usage

### Admin Dashboard

1. Navigate to `/admin/onboarding`
2. **Theme Tab**: Customize colors, buttons, logo, and welcome page
3. **Steps Tab**: Add, edit, reorder, and delete steps
   - Drag and drop steps to reorder
   - Click "Edit" to modify a step
   - Toggle steps on/off
4. **Preview Tab**: See how the onboarding looks to buyers
5. **Publish**: Click "Publish" to make changes live

### Buyer Experience

Buyers access onboarding via:
```
/onboarding/[whopId]
```

The onboarding automatically:
- Loads the published version for that Whop ID
- Tracks progress per user
- Saves state to database
- Shows XP and progress indicators

## API Endpoints

### Admin Endpoints

- `GET /api/onboarding/draft?whop_id=...` - Get draft config
- `PUT /api/onboarding/draft` - Update draft theme/welcome
- `GET /api/onboarding/draft/steps?whop_id=...` - Get draft steps
- `POST /api/onboarding/draft/steps` - Update draft steps
- `POST /api/onboarding/publish` - Publish draft

### Buyer Endpoints

- `GET /api/onboarding/published?whop_id=...` - Get published config
- `POST /api/onboarding/progress/step-complete` - Track step completion
- `POST /api/onboarding/progress/complete` - Track completion

## Multi-Tenancy

The system supports multi-tenancy where each creator can customize their own onboarding. Currently, ownership verification is **disabled** for easier development. To enable it:

1. Uncomment the auth imports in API routes
2. Integrate with Whop SDK authentication
3. Update `lib/auth/useWhopAuth.ts` to use real auth
4. See `MULTI-TENANCY.md` for detailed instructions

## Customization

### Adding New Step Types

1. Add step type to `lib/onboarding/config-types.ts`
2. Create component in `components/onboarding/steps/Step[Type].tsx`
3. Add to `OnboardingRenderer.tsx`
4. Add editor in `components/admin/StepEditor.tsx`

### Theme Customization

All theme values are customizable through the admin dashboard:
- Colors (primary, secondary, light)
- Button styles (radius, variants)
- Gradients
- Logo and cover images
- Welcome page text

## Development

### Database Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name migration-name

# Apply migrations in production
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset
```

### Prisma Studio

View and edit database records:
```bash
pnpm prisma studio
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Environment Variables for Production

- `DATABASE_URL` - Your production database connection string
- (Optional) `DEFAULT_WHOP_ID` - For development/testing

## License

MIT

## Acknowledgments

- [Next.js](https://nextjs.org/) - Framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Tailwind CSS](https://tailwindcss.com/) - Styling
