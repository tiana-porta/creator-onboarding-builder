# WHOP 5-Day Challenge

A calendar-based drip-feed challenge app for Whop that unlocks days based on scheduled dates, not completion.

## Features

- 📅 **Calendar-based Drip Feed**: Days unlock only when their scheduled date arrives
- 🎯 **5-Day Challenge**: "Launch Your First Paid Community (Build As You Go)"
- 📊 **Gamification**: Points, leaderboard, and badges
- 🔒 **Locked Day Protection**: Users cannot access locked days
- 🎨 **Consistent UI**: Reuses components from the onboarding app

## Architecture

This app lives in `apps/whop-5day-challenge/` and imports UI components from the onboarding app using relative paths. The onboarding app remains completely unchanged.

### Key Design Decisions

1. **Separate Next.js App**: Independent app with its own routes and state
2. **Component Reuse**: Imports components from `../../components/onboarding/`
3. **localStorage MVP**: Progress and leaderboard stored in localStorage (can be swapped for DB)
4. **Drip Feed Logic**: Days unlock based on calendar dates in `CHALLENGE_START_DATE`

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- The onboarding app dependencies (components must be available)

### Installation

```bash
cd apps/whop-5day-challenge
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Challenge Start Date (YYYY-MM-DD format)
# Days unlock at midnight America/New_York timezone
CHALLENGE_START_DATE=2024-01-01

# Optional: Default experience ID
DEFAULT_EXPERIENCE_ID=default
```

### Run Development Server

```bash
npm run dev
```

The app will run on port 3001 (to avoid conflicts with onboarding app on 3000).

Open [http://localhost:3001/experiences/default](http://localhost:3001/experiences/default)

## Project Structure

```
apps/whop-5day-challenge/
├── app/
│   ├── experiences/
│   │   └── [experienceId]/
│   │       ├── page.tsx              # Dashboard
│   │       ├── day/
│   │       │   └── [dayNumber]/
│   │       │       └── page.tsx      # Day detail page
│   │       └── leaderboard/
│   │           └── page.tsx          # Leaderboard
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── challengeContent.ts           # All 5 days of content
│   ├── challengeSchedule.ts          # Drip feed date logic
│   ├── progressStore.ts              # User progress tracking
│   ├── leaderboardStore.ts           # Leaderboard management
│   ├── scoring.ts                    # Points calculation
│   └── whop-api.ts                   # Whop API integration (placeholder)
└── package.json
```

## Challenge Content

All challenge content is defined in `lib/challengeContent.ts`:
- Day 1: Model & Opportunity
- Day 2: Market Research
- Day 3: The Offer
- Day 4: Pre-Sell & Setup
- Day 5: Launch & Deliver

## Drip Feed Logic

Days unlock based on the `CHALLENGE_START_DATE`:
- Day 1 unlocks at START_DATE 00:00 (timezone)
- Day 2 unlocks at START_DATE + 1 day 00:00
- Day 3 unlocks at START_DATE + 2 days 00:00
- Day 4 unlocks at START_DATE + 3 days 00:00
- Day 5 unlocks at START_DATE + 4 days 00:00

**Important**: Users cannot unlock days early by completing previous days. Unlocking is calendar-based only.

## Scoring System

- Action items: 10 points each
- Day completion bonus: 50 points
- All 5 days completion bonus: 200 points

## Data Storage

Currently uses localStorage (MVP). The store interfaces are designed to be easily swapped for a database:

- `ProgressStore`: `getProgress()`, `saveProgress()`, `updateActionItem()`, `completeDay()`
- `LeaderboardStore`: `getLeaderboard()`, `submitScore()`, `getUserRank()`

## Authentication

The app currently uses a mock user ID. To integrate with Whop API:

1. Install `@whop/api` package
2. Update `lib/whop-api.ts` to use `verifyUserToken(headers())`
3. Update pages to call `verifyUserToken()` and handle errors

## Notes

- Components are imported from the onboarding app using relative paths
- The onboarding app remains completely unchanged
- This is a separate Next.js app with its own build process
- For production, consider proper timezone handling (date-fns-tz or luxon)

