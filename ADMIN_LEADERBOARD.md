# Admin Leaderboard Implementation

## Overview

This implementation adds webhook tracking and an admin-only leaderboard for monitoring onboarding completions and progress.

## What Was Implemented

### 1. **Data Storage** (`lib/admin/storage.ts`)
- File-based JSON storage in `/data/onboarding-records.json`
- Tracks user onboarding progress, completions, XP, class selection, and store verification
- Automatically creates data directory and file if they don't exist

### 2. **Webhook Integration** (`app/api/webhooks/onboarding/route.ts`)
- Enhanced existing webhook handler to store data in the new storage system
- Tracks three events:
  - `onboarding_started` - When a user first starts onboarding
  - `step_progress` - When a user progresses through steps
  - `onboarding_completed` - When a user completes onboarding
- Still maintains Google Sheets integration (dual storage)

### 3. **Admin Leaderboard API** (`app/api/admin/leaderboard/route.ts`)
- Protected API endpoint that returns leaderboard statistics
- Returns: total started, total completed, completion rate, average XP, and sorted user list
- Currently uses simple API key authentication (needs proper Whop integration)

### 4. **Admin Leaderboard Page** (`app/admin/leaderboard/page.tsx`)
- Full-featured leaderboard UI showing:
  - Overview stats (Total Started, Completed, Completion Rate, Average XP)
  - Detailed table with all users
  - Status indicators (Completed vs In Progress)
  - User details (email, step, XP, class, store verification, duration, completion time)
  - Auto-refreshes every 30 seconds

## Environment Variables Required

Add these to your `.env.local`:

```env
# Whop API Credentials (from https://docs.whop.com/developer/api/getting-started)
WHOP_API_KEY=your_whop_api_key_here
WHOP_APP_ID=app_xxxxxxxxxxxxxx
WHOP_AGENT_USER_ID=user_xxxxxxxxxxxxxx

# Admin API Key (use same as webhook secret for now)
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
```

## How to Use

### Access the Leaderboard

1. **Development**: Visit `http://localhost:3000/admin/leaderboard`
2. **Production**: Visit `https://your-domain.com/admin/leaderboard`

⚠️ **Note**: The admin authentication currently needs proper Whop SDK integration. For now, you'll need to:
- Implement proper Whop authentication using `@whop/sdk`
- Or configure the API to use your webhook secret for basic protection

### Data Storage

- Data is stored in `/data/onboarding-records.json`
- This file is gitignored (won't be committed)
- For production, consider migrating to a proper database (PostgreSQL, MongoDB, etc.)

### Webhook Events

The system tracks:
- **onboarding_started**: Triggered when user first starts (step 1)
- **step_progress**: Triggered on each step progress
- **onboarding_completed**: Triggered when onboarding is fully completed

## Next Steps for Production

### 1. **Proper Authentication**
- Integrate Whop SDK authentication for admin access
- Use Whop's session/context to verify admin users
- Implement proper user identification from Whop

### 2. **Database Migration**
- Replace file-based storage with a proper database
- Recommended: PostgreSQL or MongoDB
- Update `lib/admin/storage.ts` to use database instead of file system

### 3. **User Identification**
- Currently uses email or generated IDs
- Integrate with Whop user IDs (`user_xxxxx`)
- Update webhook handler to extract Whop user ID from context

### 4. **Whop API Integration**
- Use Whop SDK to:
  - Get user information
  - Verify admin status
  - Send events to Whop (if needed)

## File Structure

```
lib/admin/
  ├── auth.ts          # Admin authentication utilities
  ├── storage.ts       # Data storage functions
  └── types.ts         # TypeScript types

app/
  ├── admin/
  │   └── leaderboard/
  │       └── page.tsx  # Admin leaderboard UI
  └── api/
      ├── admin/
      │   └── leaderboard/
      │       └── route.ts  # Leaderboard API endpoint
      └── webhooks/
          └── onboarding/
              └── route.ts  # Updated webhook handler

data/
  └── onboarding-records.json  # Data storage (gitignored)
```

## Troubleshooting

### Leaderboard shows "Unauthorized"
- Check that `WHOP_WEBHOOK_SECRET` or `WHOP_API_KEY` is set in `.env.local`
- For production, implement proper Whop authentication

### No data showing
- Ensure webhooks are being sent (check browser console)
- Check that `/data` directory exists and is writable
- Verify webhook handler is receiving events

### Data not persisting
- Check file permissions on `/data` directory
- Verify the app has write access
- Check server logs for storage errors

