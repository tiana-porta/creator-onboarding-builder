# Whop University Onboarding

Gamified onboarding wizard for Whop University built with Next.js, TypeScript, Frosted UI, and Tailwind CSS.

## Features

- 🎮 **6-Step Gamified Onboarding Flow**
  - Step 1: Class Selection (Architect/Sensei/Builder)
  - Step 2: Commitment Video
  - Step 3: Dashboard Tour
  - Step 4: Store Verification (Required)
  - Step 5: Notification Preferences
  - Step 6: Final Gateway

- 🎨 **Premium UI**
  - Glassmorphism effects
  - Smooth animations with Framer Motion
  - Confetti celebrations
  - XP tracking system
  - Progress indicators

- 📊 **Backend Integration**
  - Webhook endpoints for tracking progress
  - Google Sheets integration
  - Follow-up messaging for incomplete onboarding
  - State persistence with localStorage

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Google Cloud Service Account (for Sheets integration)
- A Google Spreadsheet ID

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your credentials
```

### Environment Variables

Edit `.env.local`:

```env
# Google Sheets API Credentials
# Get these from Google Cloud Console -> Service Account
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here

# Webhook Secret for API authentication
WEBHOOK_SECRET=your-random-secret-key-here

# Your app URL (for follow-up messages)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Google Sheets Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a Service Account
5. Download the JSON key file
6. Extract `client_email` and `private_key` from the JSON
7. Create a new Google Spreadsheet
8. Share it with the service account email (Editor permission)
9. Copy the Spreadsheet ID from the URL

### Initialize the Sheet

Once your environment is set up, initialize the sheet headers:

```bash
curl -X POST http://localhost:3000/api/sheets/initialize
```

Or visit the endpoint in your browser after starting the dev server.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/onboarding](http://localhost:3000/onboarding) with your browser.

## API Endpoints

### Webhooks

**POST** `/api/webhooks/onboarding`
- Tracks onboarding progress and completions
- Automatically called from the onboarding flow
- Headers: `x-webhook-secret` (optional, if WEBHOOK_SECRET is set)

### Sheets

**POST** `/api/sheets/initialize`
- Initializes the Google Sheet with headers

**GET** `/api/sheets/incomplete`
- Returns list of users who haven't completed onboarding after 24 hours

**POST** `/api/sheets/followup`
- Generates follow-up messages for incomplete users
- Body parameters:
  - `dryRun`: boolean - Preview messages without sending
  - `sendMessages`: boolean - Actually send messages (requires messaging integration)

## Scheduled Follow-ups

To automatically check for incomplete users and send follow-up messages, set up a cron job or scheduled task:

```bash
# Example cron job (runs daily at 9 AM)
0 9 * * * curl -X POST https://your-domain.com/api/sheets/followup -H "Content-Type: application/json" -d '{"sendMessages":true}'
```

Or use a service like Vercel Cron, GitHub Actions, or similar.

## Project Structure

```
whop-onboarding/
├── app/
│   ├── api/              # API routes
│   │   ├── webhooks/     # Webhook endpoints
│   │   └── sheets/       # Sheets integration
│   ├── onboarding/       # Main onboarding page
│   ├── university/       # Post-onboarding page
│   ├── create/           # Placeholder store creation
│   └── layout.tsx        # Root layout
├── components/
│   └── onboarding/       # Onboarding step components
├── lib/
│   ├── onboarding/       # State management & utilities
│   └── sheets/           # Google Sheets client
└── ...
```

## Brand Colors

- **Primary**: `#141212` (Dark)
- **Accent**: `#FA4616` (Orange)
- **Light**: `#FCF6F5` (Cream)

## State Management

Onboarding state is persisted in `localStorage` with key `whop_u_onboarding_v1`. The state includes:

- Current step (1-6)
- XP points
- Selected class
- Store verification status
- Notification preferences
- Timestamps

## Customization

### Adding Messaging Integration

Edit `/app/api/sheets/followup/route.ts` to integrate with your messaging service:

```typescript
// Example: Email integration
import { sendEmail } from '@/lib/email'

await sendEmail(item.user.email, item.message)
```

### Modifying Steps

Each step is a component in `/components/onboarding/`. Edit the component files to customize content and behavior.

## License

MIT

## Acknowledgments

- [Frosted UI](https://github.com/whopio/frosted-ui) - Design system
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Next.js](https://nextjs.org/) - Framework