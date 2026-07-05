import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export async function initUserSubscription(userId: string) {
  const userRef = doc(db, "users", userId, "subscription", "details");
  
  await setDoc(userRef, {
    status: "active",
    plan: "free",
    monthlyLimit: 3, // FREE_PLAN_LIMIT
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stripeCustomerId: "", // Will be set when user subscribes
    stripeSubscriptionId: "", // Will be set when user subscribes
    stripePriceId: "", // Will be set when user subscribes
    stripeCurrentPeriodEnd: null, // Will be set when user subscribes
  }, { merge: true });
}