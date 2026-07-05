import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    // Warn but don't crash if not set during build/dev
    console.warn('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia',
    typescript: true,
});

export async function reportUsage(subscriptionItemId: string, quantity: number) {
    if (!process.env.STRIPE_SECRET_KEY) return;

    try {
        await stripe.subscriptionItems.createUsageRecord(
            subscriptionItemId,
            {
                quantity: quantity,
                timestamp: Math.floor(Date.now() / 1000),
                action: 'increment',
            }
        );
    } catch (error) {
        console.error('Error reporting usage to Stripe:', error);
    }
}
