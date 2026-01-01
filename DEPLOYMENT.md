# 🚀 Deployment Guide: AI Job Translator SaaS

Congratulations! Your application is ready for the real world. Here is your step-by-step guide to launching it.

## 1. Prerequisites

-   **GitHub Account**: To host your code.
-   **Vercel Account**: To host your application (easiest for Next.js).
-   **Supabase Account**: You already have this!
-   **Stripe Account**: You already have this!

## 2. Push Code to GitHub

1.  Initialize git if you haven't:
    ```bash
    git init
    git add .
    git commit -m "Ready for launch"
    ```
2.  Create a new repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## 3. Deploy to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Environment Variables**: You MUST add all the variables from your `.env.local` to Vercel.
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    -   `SUPABASE_SERVICE_ROLE_KEY` (Required for the Matching Engine)
    -   `GEMINI_API_KEY`
    -   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Use Live keys for real money!)
    -   `STRIPE_SECRET_KEY` (Use Live keys!)
    -   `STRIPE_WEBHOOK_SECRET` (You'll get this in step 5)
    -   `NEXT_PUBLIC_STRIPE_PRICE_ID` (Create a live product in Stripe)
    -   `NEXT_PUBLIC_APP_URL` (Set this to your Vercel domain, e.g., `https://your-app.vercel.app`)

5.  Click **"Deploy"**.

## 4. Supabase Production Setup

1.  Go to your Supabase Dashboard.
2.  **Site URL**: Go to Authentication > URL Configuration.
    -   Set **Site URL** to your Vercel domain (e.g., `https://your-app.vercel.app`).
    -   Add `https://your-app.vercel.app/**` to **Redirect URLs**.

## 5. Stripe Live Mode

1.  Go to Stripe Dashboard and toggle **"Test Mode"** to **"Live"**.
2.  **Get Live Keys**: Copy your Live Publishable and Secret keys.
3.  **Create Live Product**: Re-create your "Pro Plan" in Live mode and get the new `price_` ID.
4.  **Update Vercel**: Update the environment variables in Vercel with these new Live keys.
5.  **Webhooks**:
    -   Go to Developers > Webhooks in Stripe (Live mode).
    -   Add Endpoint: `https://your-app.vercel.app/api/stripe/webhook`
    -   Select events: `checkout.session.completed`, `invoice.payment_succeeded`.
    -   Copy the **Signing Secret** (`whsec_...`) and add it to Vercel env vars as `STRIPE_WEBHOOK_SECRET`.

## 6. Final Check

1.  Redeploy Vercel (if you changed env vars).
2.  Visit your live URL.
3.  Sign up with a real email.
4.  Test the upgrade flow (you can create a 100% off coupon in Stripe to test live payments without spending money).

**You are now live! 🌍**
