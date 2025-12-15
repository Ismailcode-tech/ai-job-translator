import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const supabase = await createClient();

    const getPlanId = (priceId: string) => {
        const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER;
        const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;

        if (priceId === starterPriceId) return 'starter';
        if (priceId === proPriceId) return 'pro';
        return 'free';
    };

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscription: any = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse('User ID is missing in metadata', { status: 400 });
        }

        const planId = getPlanId(subscription.items.data[0].price.id);

        await supabase.from('subscriptions').insert({
            user_id: session.metadata.userId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_end: new Date(
                subscription.current_period_end * 1000
            ).toISOString(),
            plan_id: planId,
        });
    }

    if (event.type === 'invoice.payment_succeeded') {
        const invoice: any = event.data.object;

        if (invoice.subscription) {
            const subscription: any = await stripe.subscriptions.retrieve(
                invoice.subscription as string
            );

            await supabase
                .from('subscriptions')
                .update({
                    status: subscription.status,
                    current_period_end: new Date(
                        subscription.current_period_end * 1000
                    ).toISOString(),
                    // We don't necessarily update plan_id here unless we suspect it changed, 
                    // but usually that comes via a different event (customer.subscription.updated).
                    // For now, extending the date is sufficient.
                })
                .eq('stripe_subscription_id', subscription.id);
        }
    }

    return new NextResponse(null, { status: 200 });
}
