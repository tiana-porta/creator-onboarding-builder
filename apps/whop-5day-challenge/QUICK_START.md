# Quick Start Guide

## What Was Built

A complete 5-Day Challenge app that:
- ✅ Lives separately from the onboarding app
- ✅ Reuses UI components from onboarding (GlassCard, ProgressHeader)
- ✅ Implements calendar-based drip feed (days unlock by date, NOT by completion)
- ✅ Includes all 5 days of challenge content
- ✅ Has a dashboard, day detail pages, and leaderboard
- ✅ Uses localStorage MVP for data storage

## Key Files

- `app/experiences/[experienceId]/page.tsx` - Dashboard with day status
- `app/experiences/[experienceId]/day/[dayNumber]/page.tsx` - Day detail pages
- `app/experiences/[experienceId]/leaderboard/page.tsx` - Leaderboard
- `lib/challengeContent.ts` - All 5 days of content
- `lib/challengeSchedule.ts` - Drip feed date logic
- `lib/progressStore.ts` - User progress tracking
- `lib/leaderboardStore.ts` - Leaderboard management

## Setup

1. **Install dependencies:**
   ```bash
   cd apps/whop-5day-challenge
   npm install
   ```

2. **Set environment variable:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local: CHALLENGE_START_DATE=2024-01-15
   ```

3. **Run the app:**
   ```bash
   npm run dev
   # Opens on http://localhost:3001
   ```

4. **Visit:**
   - Dashboard: http://localhost:3001/experiences/default
   - Day 1: http://localhost:3001/experiences/default/day/1
   - Leaderboard: http://localhost:3001/experiences/default/leaderboard

## Important Notes

1. **Component Imports**: The app imports components from the onboarding app using relative paths (e.g., `../../../../../../components/onboarding/GlassCard`). This works but is verbose.

2. **Authentication**: Currently uses a mock user ID. To integrate with Whop API:
   - Install `@whop/api`
   - Update `lib/whop-api.ts` to use `verifyUserToken(headers())`
   - Update pages to call `verifyUserToken()`

3. **Data Storage**: Uses localStorage (MVP). The store interfaces are designed to be easily swapped for a database.

4. **Drip Feed**: Days unlock based on `CHALLENGE_START_DATE`. Users cannot unlock days early by completing previous days.

5. **Onboarding App**: The onboarding app at the root remains completely unchanged.

