# Multi-Tenancy Support

This onboarding builder supports **full multi-tenancy** - each creator can customize and manage their own onboarding flow independently.

## How It Works

### Database Level
- Each `Onboarding` record has a unique `whopId` field
- All onboarding configs are scoped by `whopId`
- User progress is tracked per `whopId` and `userId`

### API Level
- All API routes verify ownership before allowing access
- Creators can only access/modify their own onboarding configs
- Returns `403 Forbidden` if attempting to access another creator's config

### Frontend Level
- Admin dashboard automatically loads the authenticated creator's onboarding
- Buyer-facing pages load the correct onboarding based on `whopId` in the URL

## Authentication Integration

### Current Implementation (Development Mode)

In development, the system uses a fallback that allows access. You **must** replace this with actual authentication for production.

### Integration with Whop SDK

1. **Update `lib/auth/useWhopAuth.ts`**:
```tsx
import { useWhop } from '@whop-apps/sdk/react'

export function useWhopAuth() {
  const { user } = useWhop()
  return {
    whopId: user?.whopId || null,
    userId: user?.id || null,
    email: user?.email || null,
    loading: !user,
  }
}
```

2. **Update `lib/auth/ownership.ts`**:
```tsx
import { getSession } from '@/lib/auth/session' // Your session handler

export async function getAuthenticatedWhopId(): Promise<string | null> {
  const session = await getSession()
  return session?.user?.whopId || null
}

export async function getAuthFromRequest(request: Request): Promise<AuthContext | null> {
  // Extract from Whop SDK context, JWT token, or session cookie
  const session = await getSessionFromRequest(request)
  if (!session?.user?.whopId) return null
  
  return {
    whopId: session.user.whopId,
    userId: session.user.id,
    email: session.user.email,
  }
}
```

3. **Update `lib/auth/middleware.ts`**:
   - The middleware already calls `verifyOwnership()` which checks if the authenticated user's `whopId` matches the requested one
   - Just ensure `getAuthFromRequest()` returns the correct auth context

## Security Features

### Ownership Verification
- Every API request verifies the creator owns the `whopId` they're accessing
- Prevents unauthorized access to other creators' configs
- Returns `403 Forbidden` on unauthorized attempts

### Data Isolation
- Database queries are scoped by `whopId`
- No cross-tenant data leakage
- Each creator's onboarding is completely isolated

### Buyer Access
- Buyers access onboarding via `/onboarding/[whopId]`
- The `whopId` in the URL determines which onboarding to show
- No authentication required for buyers (public access)

## Testing Multi-Tenancy

### Development Mode
1. Set `whopId` in localStorage: `localStorage.setItem('whopId', 'your-whop-id')`
2. The admin dashboard will use this `whopId`
3. API routes will allow access in development mode

### Production Mode
1. Integrate with Whop SDK authentication
2. Update auth helpers to use real session/auth
3. Ownership verification will be enforced automatically

## API Endpoints

All endpoints require `whop_id` and verify ownership:

- `GET /api/onboarding/draft?whop_id=...` - Get draft config
- `PUT /api/onboarding/draft` - Update draft (requires `whop_id` in body)
- `POST /api/onboarding/draft/steps` - Update steps (requires `whop_id` in body)
- `POST /api/onboarding/publish` - Publish draft (requires `whop_id` in body)
- `GET /api/onboarding/published?whop_id=...` - Get published config (public)

## Example: Multiple Creators

```typescript
// Creator A's onboarding
whopId: "creator-a-whop"
→ Has their own theme, steps, and published version

// Creator B's onboarding  
whopId: "creator-b-whop"
→ Completely separate config, theme, and steps

// Creator A cannot access Creator B's config (403 Forbidden)
// Creator B cannot access Creator A's config (403 Forbidden)
```

## Next Steps

1. ✅ Database schema supports multi-tenancy
2. ✅ API routes verify ownership
3. ✅ Admin dashboard uses authenticated `whopId`
4. ⚠️ **TODO**: Integrate with Whop SDK authentication
5. ⚠️ **TODO**: Replace development mode fallbacks with real auth

