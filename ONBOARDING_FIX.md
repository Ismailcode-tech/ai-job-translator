# Onboarding Fix Summary

## Issue
Users complete onboarding (select Individual/Company), the database updates successfully, but they get redirected back to the onboarding page in a loop.

## Root Cause
1. Database update succeeds
2. Client-side redirect happens
3. Dashboard layout fetches profile data (cached or stale)
4. Sees `user_type` as null
5. Redirects back to onboarding

## Solution Applied

### 1. Server Action (`app/onboarding/user-type/actions.ts`)
- ✅ Update `user_type` in database
- ✅ Verify update by re-fetching profile
- ✅ Revalidate all dashboard paths
- ✅ Return success with redirect path

### 2. Client Component (`app/onboarding/user-type/page.tsx`)
- ✅ Use `useRouter()` for client-side navigation
- ✅ Handle success/error responses
- ✅ Show loading states

### 3. Dashboard Layout (`app/dashboard/layout.tsx`)
- ✅ Added `export const dynamic = 'force-dynamic'` to prevent caching
- ✅ Use `.maybeSingle()` instead of `.single()` to handle missing profiles gracefully
- ✅ Added console logs for debugging

### 4. Database (`profiles` table)
- ✅ Added `user_type` column with default 'individual'
- ✅ Added CHECK constraint for 'individual' or 'company'
- ✅ Added RLS policy to allow users to update their own user_type

## Testing
1. Go to `/onboarding/user-type`
2. Click "Individual" or "Organization"
3. Check terminal for logs:
   - "Updating user type for user: [id] to: [type]"
   - "User type updated successfully"
   - "Verification successful - user_type is: [type]"
4. Should redirect to appropriate dashboard

## If Still Failing
Check terminal logs to see which step is failing:
- Update failing? → Database permissions issue
- Verification failing? → Data not persisting
- Redirect loop? → Cache still not cleared
