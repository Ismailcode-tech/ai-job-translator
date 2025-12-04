# Disable Email Confirmation in Supabase

The email OTP verification is experiencing persistent token expiry issues. The recommended solution is to **disable email confirmation** in Supabase so users can sign up and access the app immediately.

## Steps to Disable Email Confirmation

1. Go to your **Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** (left sidebar)
4. Click **Providers** under the CONFIGURATION section
5. Click on **Email** provider
6. **Uncheck** the box that says **"Confirm email"**
7. Click **Save**

## What This Means

- Users will be able to sign up and immediately access the dashboard
- No email verification code required
- Users can still change their password via email if needed
- This is a common setup for many SaaS applications

## Alternative: Manual Verification

If you absolutely need email verification:
1. Keep "Confirm email" enabled
2. Users will receive an email with a **link** (not a code)
3. They click the link to verify
4. The link redirects to your app

To use this approach, we would need to:
- Remove the `/verify-email` page
- Update the signup flow to show "Check your email for a verification link"
- Create an `/auth/callback` page to handle the redirect after clicking the link

**Which approach would you prefer?**
