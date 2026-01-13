# Complete Whop App Setup Guide

## ✅ What We Just Fixed

1. **Installed `@whop/react`** - Required for Whop app integration
2. **Updated `next.config.mjs`** - Added `withWhopAppConfig` wrapper
3. **This enables Server Actions** - Required for Whop apps to work on Vercel

## 📋 Complete Setup Checklist

### 1. Vercel Environment Variables (REQUIRED)

Go to Vercel → Your Project → Settings → Environment Variables

Add these **4 required variables**:

```
WHOP_API_KEY=apik_QxAFKOlZtIHMH_A2023038_C_ab551756321c8de8e90f959c5d25c46549f35cef641b6f8537abe6526639e7
```

```
NEXT_PUBLIC_WHOP_APP_ID=app_AVNFP7BwO95Bf8
```

```
WHOP_AGENT_USER_ID=user_1QfU7nKKlBCBw
```

```
NEXT_PUBLIC_APP_URL=https://whop-onboarding-tianas-projects-0123e502.vercel.app
```

**Important:** Replace the URL above with your actual Vercel production URL!

### 2. Redeploy After Adding Variables

1. Go to Vercel → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### 3. Whop Dashboard Configuration

Go to Whop → Developer → Apps → Your App (`app_AVNFP7BwO95Bf8`)

#### Base URL
Set to your **main production Vercel URL** (not the deployment-specific one):
- Example: `https://whop-onboarding-tianas-projects-0123e502.vercel.app`
- Find this in Vercel dashboard → Your Project → Overview → Production URL

#### Experience Path
Set to: `/onboarding`

This is your main onboarding flow.

#### Dashboard Path (Optional)
Set to: `/admin/leaderboard` or leave blank

#### Discover Path (Optional)
Leave blank or set to `/`

### 4. Verify Your Vercel URL

1. Go to Vercel Dashboard
2. Click on your `whop-onboarding` project
3. Look at the top - there should be a "Visit" button or production URL
4. Copy that exact URL
5. Test it: Visit `https://your-url.vercel.app/onboarding` in your browser
6. It should load without errors

### 5. Test the App

1. **Test directly on Vercel:**
   - Visit: `https://your-url.vercel.app/onboarding`
   - Should load the onboarding flow

2. **Test through Whop:**
   - Go to Whop dashboard
   - Access your app through Whop
   - Should now work without 404!

## 🔍 Troubleshooting

### Still Getting 404?

1. **Verify the Base URL in Whop:**
   - Must match your Vercel production URL exactly
   - Must start with `https://`
   - No trailing slash

2. **Check Experience Path:**
   - Must be `/onboarding` (not `/experiences/[experienceId]`)

3. **Verify Deployment:**
   - Go to Vercel → Deployments
   - Latest deployment should show "Ready" status
   - Check build logs for errors

4. **Environment Variables:**
   - All 4 required variables must be set
   - Must redeploy after adding variables

### Server Actions Not Working?

The `withWhopAppConfig` wrapper we just added should fix this. Make sure:
- ✅ `next.config.mjs` uses `withWhopAppConfig`
- ✅ `@whop/react` is installed (we just did this)
- ✅ Code is pushed to GitHub
- ✅ Vercel has redeployed with the new config

### "Refused to Connect" Error?

This is usually a network issue:
- Try different browser/incognito
- Try different network
- Check if Vercel dashboard is accessible
- Verify the URL is correct

## 📝 What Changed

### Files Modified:
- ✅ `next.config.mjs` - Added Whop config wrapper
- ✅ `package.json` - Added `@whop/react` dependency
- ✅ `package-lock.json` - Updated dependencies

### What `withWhopAppConfig` Does:
- Enables Server Actions for Whop apps
- Sets up proper CORS and security headers
- Configures import optimizations
- Required for Whop apps to work on Vercel

## 🚀 Next Steps

1. ✅ Code is pushed to GitHub
2. ⏳ Wait for Vercel to auto-deploy (or trigger manual deploy)
3. ⏳ Add environment variables in Vercel
4. ⏳ Redeploy after adding variables
5. ⏳ Configure paths in Whop dashboard
6. ⏳ Test the app!

## 📞 Need Help?

If you're still getting 404:
1. Share your exact Vercel production URL
2. Share what paths you set in Whop dashboard
3. Check Vercel deployment logs for errors
4. Verify all environment variables are set

The key is making sure:
- ✅ Base URL in Whop matches Vercel production URL
- ✅ Experience path is `/onboarding`
- ✅ All environment variables are set
- ✅ App is redeployed after changes

