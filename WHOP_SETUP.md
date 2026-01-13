# Setting Up Your App in Whop Dashboard

If you're getting a 404 error on Whop, follow these steps to configure your app:

## Step 1: Get Your Vercel Deployment URL

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `whop-onboarding` project
3. Copy your deployment URL (e.g., `https://whop-onboarding.vercel.app` or your custom domain)

## Step 2: Configure App URL in Whop Dashboard

1. **Log in to Whop Dashboard**
   - Go to [whop.com](https://whop.com) and log in
   - Navigate to your company/developer dashboard

2. **Find Your App**
   - Go to **Developer** → **Apps** (or **Webhooks** → **Apps**)
   - Find your app with ID: `app_AVNFP7BwO95Bf8`
   - Click on it to open settings

3. **Set the App URL**
   - Look for **"App URL"** or **"Application URL"** field
   - Paste your Vercel deployment URL (e.g., `https://whop-onboarding.vercel.app`)
   - Make sure it's the full URL with `https://`
   - Save the changes

4. **Verify App Status**
   - Make sure your app is **Enabled** or **Active**
   - Check if there are any pending approvals or status issues

## Step 3: Set Environment Variables in Vercel

1. **Go to Vercel Project Settings**
   - Open your project in Vercel dashboard
   - Go to **Settings** → **Environment Variables**

2. **Add Required Variables**
   Add these environment variables (from your `.env.local`):

   ```
   WHOP_API_KEY=apik_QxAFKOlZtIHMH_A2023038_C_ab551756321c8de8e90f959c5d25c46549f35cef641b6f8537abe6526639e7
   NEXT_PUBLIC_WHOP_APP_ID=app_AVNFP7BwO95Bf8
   WHOP_AGENT_USER_ID=user_1QfU7nKKlBCBw
   NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
   ```

   **Important:**
   - Replace `https://your-vercel-url.vercel.app` with your actual Vercel URL
   - Set these for **Production**, **Preview**, and **Development** environments
   - After adding variables, **redeploy** your app

3. **Optional: Add Google Sheets Variables** (if using Sheets integration)
   ```
   GOOGLE_SHEETS_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
   WEBHOOK_SECRET=your-secret-key
   ```

## Step 4: Redeploy After Adding Environment Variables

After adding environment variables in Vercel:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for the deployment to complete

## Step 5: Test Your App

1. **Test the Vercel URL directly**
   - Visit `https://your-app.vercel.app/onboarding` in your browser
   - It should load without errors

2. **Test from Whop**
   - Go back to Whop dashboard
   - Try accessing your app through Whop
   - The 404 should be resolved

## Troubleshooting

### Still Getting 404?

1. **Check App URL Format**
   - Must start with `https://`
   - No trailing slash
   - Example: `https://whop-onboarding.vercel.app` ✅
   - Not: `https://whop-onboarding.vercel.app/` ❌

2. **Verify Deployment Status**
   - Check Vercel deployment logs for errors
   - Make sure the build completed successfully
   - Check that all environment variables are set

3. **Check Whop App Status**
   - Make sure the app is **Active** or **Enabled**
   - Check for any pending approvals
   - Verify the app ID matches: `app_AVNFP7BwO95Bf8`

4. **Clear Cache**
   - Try accessing the app in an incognito/private window
   - Clear browser cache
   - Wait a few minutes for DNS/propagation

5. **Check Vercel Build Logs**
   - Go to Vercel → Your Project → Deployments
   - Click on the latest deployment
   - Check the build logs for any errors

### App Loads But Shows Errors?

1. **Check Environment Variables**
   - Make sure all required variables are set in Vercel
   - Verify `NEXT_PUBLIC_APP_URL` matches your Vercel URL
   - Redeploy after adding variables

2. **Check Browser Console**
   - Open browser DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

3. **Check Vercel Function Logs**
   - Go to Vercel → Your Project → Functions
   - Check for any runtime errors

## Quick Checklist

- [ ] Vercel deployment is successful
- [ ] App URL is set in Whop dashboard (with `https://`)
- [ ] Environment variables are set in Vercel
- [ ] App is redeployed after adding environment variables
- [ ] App is Active/Enabled in Whop dashboard
- [ ] App URL works when accessed directly (not through Whop)
- [ ] No errors in Vercel build logs

## Need More Help?

- **Whop Documentation**: https://docs.whop.com
- **Vercel Documentation**: https://vercel.com/docs
- **Whop Support**: Contact through your Whop dashboard

## Common Issues

### Issue: "App URL must be HTTPS"
**Solution**: Make sure your Vercel URL starts with `https://`

### Issue: "App not found"
**Solution**: Double-check the app ID in Whop dashboard matches `app_AVNFP7BwO95Bf8`

### Issue: "Environment variables not working"
**Solution**: 
- Make sure variables are set for the correct environment (Production)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue: "Build fails on Vercel"
**Solution**: 
- Check build logs in Vercel
- Make sure all dependencies are in `package.json`
- Verify Node.js version is compatible

