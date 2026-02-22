import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
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

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse('User id is required', { status: 400 });
        }

        const supabase = await createClient();

        // Map price ID to role (You should replace these with your actual Stripe Price IDs)
        // For demonstration, we'll use metadata or price looking
        let role: 'semi-pro' | 'pro' = 'semi-pro';
        if (subscription.items.data[0].price.id === process.env.STRIPE_PRO_PRICE_ID) {
            role = 'pro';
        }

        const { error } = await supabase
            .from('user_profiles')
            .update({ role })
            .eq('id', session.metadata.userId);

        if (error) {
            console.error('[WEBHOOK_UPDATE_ERROR]', error);
            return new NextResponse('Internal Error', { status: 500 });
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        const supabase = await createClient();

        // Find user by stripe customer id or metadata if possible
        // Note: You should store stripe_customer_id in user_profiles for better lookup
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', subscription.metadata.userId)
            .single();

        if (profile) {
            await supabase
                .from('user_profiles')
                .update({ role: 'beginner' })
                .eq('id', profile.id);
        }
    }

    return new NextResponse(null, { status: 200 });
}
