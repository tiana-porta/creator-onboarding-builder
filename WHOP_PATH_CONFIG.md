# Whop Dashboard Path Configuration

## The Problem

Your Whop dashboard is configured with paths that don't exist in your app:
- ❌ Experience path: `/experiences/[experienceId]` - **This route doesn't exist**
- ❌ Dashboard path: `/dashboard/[companyId]` - **This route doesn't exist**
- ❌ Discover path: `/discover` - **This route doesn't exist**

## Your Actual App Routes

Your app has these routes:
- ✅ `/` (root) - redirects to `/onboarding`
- ✅ `/onboarding` - **Main onboarding flow** (this is what you want!)
- ✅ `/university` - Post-onboarding page
- ✅ `/create` - Store creation page
- ✅ `/admin/leaderboard` - Admin dashboard

## Correct Whop Configuration

In your Whop dashboard, set these paths:

### Base URL
Make sure this matches your actual Vercel URL:
- Check which one is correct: `https://whop-onboarding-icwi.vercel.app` OR `https://whop-onboarding-tianas-projects-0123e502.vercel.app`
- Use the one that works when you visit it directly in your browser

### Experience Path
**Set to:** `/onboarding`

This is your main onboarding flow that users should see.

### Dashboard Path (Optional)
**Set to:** `/admin/leaderboard` (if you want users to access the admin dashboard)

OR leave it empty/blank if you don't need it.

### Discover Path (Optional)
**Leave empty** or set to `/` if you want a discover page.

## Step-by-Step Fix

1. **Verify your Vercel URL:**
   - Go to Vercel dashboard
   - Check which URL is actually deployed and working
   - Test it: visit `https://your-url.vercel.app/onboarding` in your browser
   - It should load without 404

2. **Update Whop Dashboard:**
   - Go to Whop → Developer → Apps → Your App
   - **Base URL:** Use your working Vercel URL
   - **Experience path:** Change to `/onboarding`
   - **Dashboard path:** Change to `/admin/leaderboard` OR leave blank
   - **Discover path:** Leave blank or set to `/`
   - **Save**

3. **Test:**
   - Try accessing your app through Whop
   - It should now load the onboarding flow

## Quick Configuration

```
Base URL: https://whop-onboarding-icwi.vercel.app (or your actual URL)
Experience path: /onboarding
Dashboard path: /admin/leaderboard (optional)
Discover path: (leave empty)
```

## Why This Fixes the 404

Whop is trying to load:
- `https://your-url.vercel.app/experiences/[experienceId]` ❌ (doesn't exist)

But your app actually has:
- `https://your-url.vercel.app/onboarding` ✅ (exists!)

So when you set the Experience path to `/onboarding`, Whop will load the correct route.

