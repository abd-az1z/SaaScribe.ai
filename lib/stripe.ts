import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    // Warn but don't crash if not set during build/dev
    console.warn('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-11-17.clover',
});

export async function reportUsage(subscriptionItemId: string, quantity: number) {
    if (!process.env.STRIPE_SECRET_KEY) return;

    try {
        // createUsageRecord was removed in Stripe API 2026+; use meter events instead.
        // This function is kept for compatibility but is a no-op in the current API version.
        console.log(`Usage report skipped — subscriptionItem: ${subscriptionItemId}, qty: ${quantity}`);
    } catch (error) {
        console.error('Error reporting usage to Stripe:', error);
    }
}
