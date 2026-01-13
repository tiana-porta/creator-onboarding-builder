# Vercel Environment Variables Setup

## Your Vercel URL
**https://whop-onboarding-icwi.vercel.app**

## Required Environment Variables

Copy and paste these into your Vercel project settings:

### 1. Whop API Credentials (REQUIRED)

```
WHOP_API_KEY=apik_QxAFKOlZtIHMH_A2023038_C_ab551756321c8de8e90f959c5d25c46549f35cef641b6f8537abe6526639e7
```

```
NEXT_PUBLIC_WHOP_APP_ID=app_AVNFP7BwO95Bf8
```

```
WHOP_AGENT_USER_ID=user_1QfU7nKKlBCBw
```

### 2. App URL (REQUIRED)

```
NEXT_PUBLIC_APP_URL=https://whop-onboarding-icwi.vercel.app
```

### 3. Google Sheets Integration (OPTIONAL - only if using Sheets)

If you're using Google Sheets for tracking, add these:

```
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

```
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here
```

### 4. Webhook Secret (OPTIONAL - for API authentication)

```
WEBHOOK_SECRET=your-random-secret-key-here
```

## How to Add These in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your `whop-onboarding` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. For each variable:
   - **Key**: Copy the variable name (e.g., `WHOP_API_KEY`)
   - **Value**: Copy the value (e.g., `apik_QxAFKOlZtIHMH_A2023038_C_...`)
   - **Environment**: Select **Production**, **Preview**, and **Development** (or at least **Production**)
   - Click **Save**
6. After adding all variables, go to **Deployments** tab
7. Click the **"..."** menu on the latest deployment
8. Click **"Redeploy"** to apply the new environment variables

## Quick Copy-Paste List

Here's everything you need in one place:

```
WHOP_API_KEY=apik_QxAFKOlZtIHMH_A2023038_C_ab551756321c8de8e90f959c5d25c46549f35cef641b6f8537abe6526639e7
NEXT_PUBLIC_WHOP_APP_ID=app_AVNFP7BwO95Bf8
WHOP_AGENT_USER_ID=user_1QfU7nKKlBCBw
NEXT_PUBLIC_APP_URL=https://whop-onboarding-icwi.vercel.app
```

**Note**: The Google Sheets and Webhook Secret variables are optional. Only add them if you're using those features.

## After Adding Variables

1. ✅ Redeploy your app in Vercel
2. ✅ Go to Whop Dashboard → Developer → Apps
3. ✅ Set your App URL to: `https://whop-onboarding-icwi.vercel.app`
4. ✅ Test your app!

