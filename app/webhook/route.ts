// route handler for webhook

import { adminDb } from "@/firebase/firebaseAdmin";
import stripe from "@/lib/stripe-server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const body = await req.text(); ////must be req.text() not req.json()

//   console.log("Headers:", headersList);
console.log("Stripe-Signature:", headersList.get("stripe-signature"));
  console.log("Body:", body);

  const signature = headersList.get("stripe-signature");
  if (!signature) {
    console.log("Missing Stripe signature");
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Missing Stripe webhook secret");
    return NextResponse.json(
      { error: "Missing Stripe webhook secret" },
      { status: 400 }
    );
  }

  // const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook signature verification failed:${err}`);
    return NextResponse.json(`Webhook signature verification failed:${err}`, {
      status: 400,
    });
  }

  // helper for events
  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();
    if (!userDoc.empty) {
      return {
        id: userDoc.docs[0].id,
        ...userDoc.docs[0].data()
      };
    }
    return null;
  };

  // handle different events
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const isActive = subscription.status === 'active' || subscription.status === 'trialing';

      const userDetails = await getUserDetails(customerId);
      if (!userDetails) {
        console.log("User not found");
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }

      await adminDb.collection("users").doc(userDetails.id).update({
        hasActiveMembership: isActive,
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id
      });
      break;
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | { id: string };
      };
      
      // Get customer ID safely
      const customerId = typeof invoice.customer === 'string' 
        ? invoice.customer 
        : invoice.customer?.id || '';
      
      // Skip if no customer ID
      if (!customerId) {
        console.log('No customer ID found in invoice');
        return NextResponse.json({ received: true });
      }

      const userDetails = await getUserDetails(customerId);
      if (!userDetails) {
        console.log("User not found");
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }

      // Prepare update data
      const updateData: {
        hasActiveMembership: boolean;
        lastPaymentDate: Date;
        subscriptionId?: string;
      } = {
        hasActiveMembership: true,
        lastPaymentDate: new Date(invoice.created * 1000),
      };

      // Get subscription ID if it exists
      if (invoice.subscription) {
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription.id;
        
        if (subscriptionId) {
          updateData.subscriptionId = subscriptionId;
        }
      }

      try {
        // Update user document
        await adminDb.collection("users").doc(userDetails.id).update(updateData);
        console.log('Successfully updated user subscription');
      } catch (error) {
        console.error('Error updating user document:', error);
        return NextResponse.json(
          { error: 'Failed to update user document' },
          { status: 500 }
        );
      }
      break;
    }

    case "customer.subscription.deleted":
    case "customer.subscription.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails) {
        console.log("User not found");
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }

      await adminDb.collection("users").doc(userDetails.id).update({
        hasActiveMembership: false,
        subscriptionStatus: 'canceled'
      });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new NextResponse("Webhook received")
}



// route handler for webhook

// import { adminDb } from "@/firebase/firebaseAdmin";
// import stripe from "@/lib/stripe-server";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { headers } from "next/headers";

// export async function POST(req: NextRequest) {
//   const headersList = await headers();
//   const body = await req.text(); ////must be req.text() not req.json()

// //   console.log("Headers:", headersList);
// console.log("Stripe-Signature:", headersList.get("stripe-signature"));
//   console.log("Body:", body);

//   const signature = headersList.get("stripe-signature");
//   if (!signature) {
//     console.log("Missing Stripe signature");
//     return NextResponse.json(
//       { error: "Missing Stripe signature" },
//       { status: 400 }
//     );
//   }
//   if (!process.env.STRIPE_WEBHOOK_SECRET) {
//     console.log("Missing Stripe webhook secret");
//     return NextResponse.json(
//       { error: "Missing Stripe webhook secret" },
//       { status: 400 }
//     );
//   }

//   // const stripe = getStripe();
//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.log(`Webhook signature verification failed:${err}`);
//     return NextResponse.json(`Webhook signature verification failed:${err}`, {
//       status: 400,
//     });
//   }

//   // helper for events
//   const getUserDetails = async (customerId: string) => {
//     const userDoc = await adminDb
//       .collection("users")
//       .where("stripeCustomerId", "==", customerId)
//       .limit(1)
//       .get();
//     if (!userDoc.empty) {
//       return {
//         id: userDoc.docs[0].id,
//         ...userDoc.docs[0].data()
//       };
//     }
//     return null;
//   };

//   // handle different events
//   switch (event.type) {
//     case 'customer.subscription.created':
//     case 'customer.subscription.updated': {
//       const subscription = event.data.object as Stripe.Subscription;
//       const customerId = subscription.customer as string;
//       const isActive = subscription.status === 'active' || subscription.status === 'trialing';

//       const userDetails = await getUserDetails(customerId);
//       if (!userDetails) {
//         console.log("User not found");
//         return NextResponse.json({ error: "User not found" }, { status: 400 });
//       }

//       await adminDb.collection("users").doc(userDetails.id).update({
//         hasActiveMembership: isActive,
//         subscriptionStatus: subscription.status,
//         subscriptionId: subscription.id
//       });
//       break;
//     }
    
//     case 'invoice.payment_succeeded': {
//       const invoice = event.data.object as Stripe.Invoice;
//       const customerId = invoice.customer as string;
//       const subscriptionId = invoice.subscription as string;

//       const userDetails = await getUserDetails(customerId);
//       if (!userDetails) {
//         console.log("User not found");
//         return NextResponse.json({ error: "User not found" }, { status: 400 });
//       }

//       await adminDb.collection("users").doc(userDetails.id).update({
//         hasActiveMembership: true,
//         lastPaymentDate: new Date(invoice.created * 1000),
//         subscriptionId: subscriptionId
//       });
//       break;
//     }

//     case "customer.subscription.deleted":
//     case "customer.subscription.canceled": {
//       const subscription = event.data.object as Stripe.Subscription;
//       const customerId = subscription.customer as string;

//       const userDetails = await getUserDetails(customerId);
//       if (!userDetails) {
//         console.log("User not found");
//         return NextResponse.json({ error: "User not found" }, { status: 400 });
//       }

//       await adminDb.collection("users").doc(userDetails.id).update({
//         hasActiveMembership: false,
//         subscriptionStatus: 'canceled'
//       });
//       break;
//     }

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   return new NextResponse("Webhook received")
// }
