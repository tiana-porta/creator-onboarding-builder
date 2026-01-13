# Comparison: Forums App (Working) vs Onboarding App (404)

## Key Differences Found

### 1. **CRITICAL: Missing `WhopApp` Wrapper in Layout**

**Forums App (WORKING):**
```tsx
// app/layout.tsx
import { WhopApp } from "@whop/react/components";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WhopApp>{children}</WhopApp>  // ← THIS IS CRITICAL!
      </body>
    </html>
  );
}
```

**Onboarding App (MISSING):**
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Theme>{children}</Theme>  // ← Missing WhopApp wrapper!
      </body>
    </html>
  );
}
```

### 2. Route Structure

**Forums App (WORKING):**
- ✅ `/experiences/[experienceId]/page.tsx` - Matches Whop's expected path
- ✅ `/dashboard/[companyId]/page.tsx` - Matches Whop's expected path  
- ✅ `/discover/page.tsx` - Matches Whop's expected path

**Onboarding App (DIFFERENT):**
- ❌ `/onboarding/page.tsx` - Doesn't match Whop's expected `/experiences/[experienceId]` pattern
- ❌ No `/dashboard/[companyId]` route
- ❌ No `/discover` route

### 3. Next.js Config

**Forums App:**
- Uses `next.config.ts` (TypeScript)
- Has `withWhopAppConfig` ✅
- Uses React 19 with @whop/react 0.3.0

**Onboarding App:**
- Uses `next.config.mjs` (JavaScript)
- Has `withWhopAppConfig` ✅
- Uses React 18 with @whop/react 0.3.1 (with .npmrc for compatibility)

### 4. Package Versions

**Forums App:**
- React: 19.2.0
- @whop/react: 0.3.0
- Next.js: 16.1.1

**Onboarding App:**
- React: 18.3.1
- @whop/react: 0.3.1
- Next.js: 14.2.0

## The Problem

Whop expects apps to have:
1. **`WhopApp` wrapper** in the root layout (CRITICAL for iframe communication)
2. **Route structure** matching `/experiences/[experienceId]` pattern
3. **Dashboard route** at `/dashboard/[companyId]`

Your onboarding app is missing:
- ❌ The `WhopApp` wrapper (most critical!)
- ❌ The `/experiences/[experienceId]` route structure

## Why You Can't Use `/onboarding` as Experience Path

Whop's system expects dynamic routes with parameters:
- Experience path: `/experiences/[experienceId]` - The `[experienceId]` is a dynamic parameter that Whop passes
- Dashboard path: `/dashboard/[companyId]` - The `[companyId]` is a dynamic parameter

You can't use a static path like `/onboarding` because Whop needs to pass the experience ID as a URL parameter.

## What Needs to Change (Without Editing Code)

Since you said not to edit code, here's what needs to happen:

### Option 1: Create the Route Structure (Recommended)
You need to create:
- `app/experiences/[experienceId]/page.tsx` - This should render your onboarding flow
- `app/dashboard/[companyId]/page.tsx` - For admin/dashboard views
- `app/discover/page.tsx` - For discover page (optional)

The `[experienceId]` page should redirect to or render your onboarding component.

### Option 2: Use WhopApp Wrapper
At minimum, you need to wrap your app with `WhopApp` component in `app/layout.tsx`:
```tsx
import { WhopApp } from "@whop/react/components";

<WhopApp>{children}</WhopApp>
```

This is critical for the app to work in Whop's iframe environment.

## Summary

The **most critical missing piece** is the `WhopApp` wrapper in your layout. This component:
- Handles iframe communication with Whop
- Provides authentication context
- Enables server actions to work properly
- Is required for Whop apps to function

Without it, your app won't work properly in Whop's environment, even if the routes are correct.

