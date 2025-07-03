// action to create checkout session

'use server'

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { adminDb } from "@/firebase/firebaseAdmin";

// Get the base URL for the current environment
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

// Initialize Stripe with error handling
const getStripe = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-06-30.basil',
  });
};

const stripe = getStripe();

export async function createCheckoutSession(userDetails: { email: string; name: string }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User ID is required");
        }

        // First check if the user has an existing stripe customer id
        let stripeCustomerId;
        const userRef = adminDb.collection("users").doc(userId);
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
            stripeCustomerId = userDoc.data()?.stripeCustomerId;
        }
        
        // Create a new customer if one doesn't exist
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: userDetails.email,
                name: userDetails.name,
                metadata: { userId },
            });
            
            await userRef.set(
                { stripeCustomerId: customer.id },
                { merge: true } // Use merge to not overwrite existing data
            );
            
            stripeCustomerId = customer.id;
        }

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [{
                price: process.env.STRIPE_PRO_PRICE_ID,
                quantity: 1,
            }],
            customer: stripeCustomerId,
            success_url: `${getBaseUrl()}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${getBaseUrl()}/upgrade?cancelled=true`,
            metadata: {
                userId,
            },
        });

        if (!session || !session.id) {
            throw new Error('Failed to create checkout session');
        }

        return session.id;
    } catch (error) {
        console.error('Error in createCheckoutSession:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create checkout session');
    }
}