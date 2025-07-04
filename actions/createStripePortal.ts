'use server'

import { adminDb } from "@/firebase/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe-server";
import { auth } from "@clerk/nextjs/server";

export async function createStripePortal() {
  try {
    console.log('Starting createStripePortal...');
    const { userId } = await auth();
    
    if (!userId) {
      console.error('No user ID found');
      throw new Error("User not found");
    }

    // Get customer id from firebase db
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData) {
      console.error('No user data found for userId:', userId);
      throw new Error("User data not found");
    }

    const stripeCustomerId = userData.stripeCustomerId;
    console.log('Found Stripe customer ID:', stripeCustomerId);

    if (!stripeCustomerId) {
      console.error('No Stripe customer ID found for user:', userId);
      throw new Error("Stripe customer ID not found");
    }

    try {
      console.log('Creating portal session for customer:', stripeCustomerId);
      
      // First, verify the customer exists in Stripe
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      console.log('Customer verified:', customer.id);
      
      // Create a simple portal session without complex configuration
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${getBaseUrl()}/dashboard`,
      });

      console.log('Portal session created successfully');
      return session.url;
      
    } catch (stripeError: any) {
      console.error('Stripe API error:', {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        statusCode: stripeError.statusCode,
        raw: stripeError.raw,
      });
      
      if (stripeError.type === 'StripeInvalidRequestError') {
        throw new Error('Invalid request to Stripe. Please check your Stripe configuration.');
      }
      
      throw new Error(`Stripe error: ${stripeError.message}`);
    }
  } catch (error: any) {
    console.error('Error in createStripePortal:', {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
 }