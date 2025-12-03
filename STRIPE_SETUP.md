# Stripe Setup Instructions

## Prerequisites
You need a Stripe account. Sign up at https://stripe.com if you don't have one.

## Step 1: Get Stripe API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## Step 2: Create a Product and Price
1. Go to https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**
3. Fill in:
   - Name: `Pro Plan`
   - Description: `Unlimited job analyses and premium features`
   - Pricing model: **Recurring**
   - Price: `$9.00`
   - Billing period: **Monthly**
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_`)

## Step 3: Add Environment Variables
Add these to your `.env.local` file:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Test the Checkout
1. Restart your dev server: `npm run dev`
2. Go to `/dashboard/billing`
3. Click **"Upgrade to Pro"**
4. You should be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

## Step 5: Set Up Webhook (Optional for local testing)
For production, you'll need to:
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET`

## Testing
- Use Stripe's test cards: https://stripe.com/docs/testing
- Check webhook events in Stripe Dashboard > Developers > Webhooks
