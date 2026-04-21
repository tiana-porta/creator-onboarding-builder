# Feature Flags Implementation Plan

## Overview

Add a feature flag system to allow per-company configuration of UI/behavior settings. Initial use case: allowing companies like Glitchy to hide user earnings and owned whops from profiles.

## Proposed Flags

```typescript
interface CompanyFeatureFlags {
  show_earnings: boolean      // default: true
  show_owned_whops: boolean   // default: true
  // future flags can be added here
}
```

---

## Files to Touch

### 1. Database Schema

**File: `supabase/migrations/002_feature_flags.sql`** (NEW)

Create a new table to store per-company feature flags:

```sql
CREATE TABLE company_feature_flags (
  id TEXT PRIMARY KEY,
  company_id TEXT UNIQUE NOT NULL,  -- Whop company/biz ID
  show_earnings BOOLEAN DEFAULT true,
  show_owned_whops BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2. Feature Flag Service

**File: `lib/feature-flags/service.ts`** (NEW)

- `getCompanyFlags(companyId: string)` - Fetch flags for a company
- `updateCompanyFlags(companyId: string, flags: Partial<FeatureFlags>)` - Update flags
- `getDefaultFlags()` - Return default flag values

---

### 3. Feature Flag Types

**File: `lib/feature-flags/types.ts`** (NEW)

```typescript
export interface FeatureFlags {
  showEarnings: boolean
  showOwnedWhops: boolean
}

export const DEFAULT_FLAGS: FeatureFlags = {
  showEarnings: true,
  showOwnedWhops: true,
}
```

---

### 4. React Hook for Feature Flags

**File: `lib/hooks/useFeatureFlags.ts`** (NEW)

A hook to access feature flags in client components:

```typescript
export function useFeatureFlags(companyId: string): FeatureFlags
```

---

### 5. API Endpoints

**File: `app/api/feature-flags/route.ts`** (NEW)

- `GET /api/feature-flags?company_id=xxx` - Get flags for a company
- `PUT /api/feature-flags` - Update flags (admin only)

---

### 6. Admin UI for Managing Flags

**File: `app/admin/settings/page.tsx`** (NEW or MODIFY existing settings)

Add a settings panel where admins can toggle feature flags for their company.

---

### 7. Components That Need Flag Checks

These existing components would need to check feature flags:

| Component | Flag Used | Change Needed |
|-----------|-----------|---------------|
| User profile earnings display | `showEarnings` | Conditionally hide earnings section |
| Owned whops list | `showOwnedWhops` | Conditionally hide owned whops |

---

## Implementation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Feature Flags Settings                              │    │
│  │  ☐ Show Earnings on User Profiles                   │    │
│  │  ☐ Show Owned Whops on User Profiles                │    │
│  │  [Save]                                              │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                         │
│  company_feature_flags table                                 │
│  ┌──────────────┬───────────────┬─────────────────┐         │
│  │ company_id   │ show_earnings │ show_owned_whops│         │
│  ├──────────────┼───────────────┼─────────────────┤         │
│  │ biz_glitchy  │ false         │ false           │         │
│  │ biz_other    │ true          │ true            │         │
│  └──────────────┴───────────────┴─────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    User-Facing UI                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  if (flags.showEarnings) {                          │    │
│  │    <EarningsSection />                               │    │
│  │  }                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## New Files Summary

| File | Purpose |
|------|---------|
| `supabase/migrations/002_feature_flags.sql` | Database schema |
| `lib/feature-flags/types.ts` | TypeScript types |
| `lib/feature-flags/service.ts` | Server-side flag operations |
| `lib/hooks/useFeatureFlags.ts` | Client-side hook |
| `app/api/feature-flags/route.ts` | API endpoints |
| `components/admin/FeatureFlagsPanel.tsx` | Admin UI component |

---

## Modified Files Summary

| File | Change |
|------|--------|
| `app/admin/settings/page.tsx` | Add feature flags panel |
| Any component showing earnings | Add flag check |
| Any component showing owned whops | Add flag check |

---

## Alternative: Environment-Based Flags

If we only need global flags (not per-company), we could use a simpler approach:

```env
# .env.local
NEXT_PUBLIC_SHOW_EARNINGS=false
NEXT_PUBLIC_SHOW_OWNED_WHOPS=false
```

However, per-company flags in the database are recommended for flexibility.

---

## Questions to Clarify

1. **Scope**: Per-company flags (recommended) or global flags?
2. **Admin Access**: Who can modify flags? Company admins? Super admins only?
3. **Caching**: Should flags be cached? For how long?
4. **Audit Trail**: Do we need to log flag changes?

---

## Estimated Effort

| Task | Estimate |
|------|----------|
| Database migration | 15 min |
| Types + Service | 30 min |
| API endpoints | 30 min |
| Admin UI | 45 min |
| Hook + integration | 30 min |
| Testing | 30 min |
| **Total** | ~3 hours |
