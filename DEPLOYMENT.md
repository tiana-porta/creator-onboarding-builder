# Deploying to Whop

This guide will help you deploy your onboarding app as a Whop app.

## Prerequisites

1. **Whop Account**: You need a Whop account and API credentials
2. **App ID**: Your Whop App ID (`app_AVNFP7BwO95Bf8`)
3. **Deployment Platform**: Vercel (recommended) or any Node.js hosting

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps and works seamlessly with Whop.

### Step 1: Prepare for Deployment

1. **Set up environment variables** for production:
   - Go to your Vercel project settings
   - Add all environment variables from `.env.local`:
     ```
     WHOP_API_KEY=apik_QxAFKOlZtIHMH_A2023038_C_ab551756321c8de8e90f959c5d25c46549f35cef641b6f8537abe6526639e7
     NEXT_PUBLIC_WHOP_APP_ID=app_AVNFP7BwO95Bf8
     WHOP_AGENT_USER_ID=user_1QfU7nKKlBCBw
     GOOGLE_SHEETS_CLIENT_EMAIL=...
     GOOGLE_SHEETS_PRIVATE_KEY=...
     GOOGLE_SHEETS_SPREADSHEET_ID=...
     WEBHOOK_SECRET=...
     ```

2. **Update next.config.js** (if needed):
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     // Add any Whop-specific config here
   }
   
   module.exports = nextConfig
   ```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Or connect your GitHub repo to Vercel for automatic deployments:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

### Step 3: Configure Whop App

1. **Get your deployment URL** from Vercel (e.g., `https://your-app.vercel.app`)

2. **Configure in Whop Dashboard**:
   - Go to your Whop App settings
   - Set the app URL to your Vercel deployment URL
   - Configure any required webhook endpoints

3. **Update app URL** in Whop:
   - If your app needs to know its own URL, use `NEXT_PUBLIC_APP_URL` env var
   - Set it to your Vercel URL: `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`

## Option 2: Deploy to Other Platforms

### Requirements:
- Node.js 18+ runtime
- Persistent storage for `/data` directory (or migrate to database)
- Environment variables configured

### Platforms that work:
- **Railway**: Easy Node.js deployments
- **Render**: Simple deployment with PostgreSQL option
- **Fly.io**: Good for Node.js apps
- **DigitalOcean App Platform**: Managed Node.js hosting
- **AWS/GCP/Azure**: More complex but full control

### Important Notes:
- The current file-based storage (`/data` directory) won't work on serverless platforms
- You'll need to migrate to a database (PostgreSQL, MongoDB) for production
- Or use a file storage service (AWS S3, etc.)

## Post-Deployment Checklist

### 1. Environment Variables
- [ ] All environment variables set in production
- [ ] `NEXT_PUBLIC_WHOP_APP_ID` is set correctly
- [ ] `WHOP_API_KEY` is set (server-side only)
- [ ] Google Sheets credentials configured

### 2. Data Storage
- [ ] Migrate from file-based storage to database (for production)
- [ ] Or configure persistent storage volume

### 3. Whop App Configuration
- [ ] App URL set in Whop dashboard
- [ ] Webhook endpoints configured (if needed)
- [ ] App is enabled/active

### 4. Testing
- [ ] Test onboarding flow end-to-end
- [ ] Test admin leaderboard access
- [ ] Verify webhook tracking works
- [ ] Check Google Sheets integration (if using)

### 5. Domain (Optional)
- [ ] Set up custom domain in Vercel
- [ ] Update Whop app URL if using custom domain
- [ ] Update `NEXT_PUBLIC_APP_URL` if needed

## Database Migration (Recommended for Production)

The current file-based storage (`/data/onboarding-records.json`) works for development but should be migrated to a database for production.

### Recommended: PostgreSQL on Vercel

1. **Add Vercel Postgres**:
   ```bash
   vercel postgres create
   ```

2. **Install Prisma or similar ORM**:
   ```bash
   npm install prisma @prisma/client
   ```

3. **Update storage.ts** to use database instead of files

### Alternative: Use MongoDB Atlas (Free Tier Available)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Install MongoDB driver: `npm install mongodb`
5. Update storage.ts

## Webhook Configuration

If you want to receive webhooks from Whop:

1. **In Whop Dashboard**:
   - Go to your app settings
   - Add webhook URL: `https://your-app.vercel.app/api/webhooks/whop`
   - Select events you want to receive

2. **Create webhook endpoint** (if needed):
   - `/app/api/webhooks/whop/route.ts`
   - Verify webhook signature
   - Handle Whop webhook events

## Troubleshooting

### App shows 404
- Check that the deployment was successful
- Verify app URL in Whop dashboard
- Check Vercel deployment logs

### Environment variables not working
- Make sure they're set in Vercel project settings
- Redeploy after adding new variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

### Data not persisting
- File-based storage doesn't work on serverless
- Migrate to database (PostgreSQL/MongoDB)
- Or use external storage service

### Admin leaderboard not accessible
- Check `WHOP_API_KEY` is set
- Verify API authentication
- Check server logs for errors

## Quick Deploy Command

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Support Resources

- **Whop Docs**: https://docs.whop.com
- **Whop App Template**: https://github.com/whopio/whop-nextjs-app-template
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

