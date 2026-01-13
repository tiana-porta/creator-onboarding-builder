# Environment Variables Setup

## Required Variables for Leaderboard

Add these to your `.env.local` file:

```env
# Whop API Credentials
WHOP_API_KEY=apik_QxAFKOlZtIHMH_A2023038_C_ab551756321c8de8e90f959c5d25c46549f35cef641b6f8537abe6526639e7
NEXT_PUBLIC_WHOP_APP_ID=app_AVNFP7BwO95Bf8
WHOP_AGENT_USER_ID=user_1QfU7nKKlBCBw

# Google Sheets (existing)
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here

# Webhook Secret (for internal API authentication)
WEBHOOK_SECRET=your-random-secret-key-here
```

## Notes

- **WHOP_API_KEY**: Used for admin leaderboard authentication (currently)
- **NEXT_PUBLIC_WHOP_APP_ID**: Whop App ID (public, can be used in client-side code)
- **WHOP_AGENT_USER_ID**: Your admin user ID for verifying admin access
- Webhook integration with Whop is currently **on hold** - internal webhooks still work for tracking

## Accessing the Leaderboard

1. Make sure `.env.local` has the above variables
2. Restart your dev server: `npm run dev`
3. Visit: `http://localhost:3000/admin/leaderboard`
4. The API will use `WHOP_API_KEY` for authentication

## Next Steps (When Ready)

- Integrate proper Whop SDK authentication
- Add Whop webhook integration for external events
- Migrate to database storage (currently using file-based JSON)

