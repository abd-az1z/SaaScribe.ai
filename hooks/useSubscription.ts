// hooks/useSubscription.ts
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { signInToFirebase } from "@/lib/firebase-auth";

export const FREE_PLAN_LIMIT = 3;

interface SubscriptionData {
  status: string;
  plan: string;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useSubscription() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Keep the unsubscribe fn in a ref so we can call it in cleanup even if the
  // component re-renders before the async init finishes.
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const initializeSubscription = async () => {
      try {
        const response = await fetch("/api/firebase-token");
        if (!response.ok) throw new Error("Failed to get Firebase token from server");
        const { token } = await response.json();
        if (!token) throw new Error("No Firebase token received");

        await signInToFirebase(token);

        if (cancelled) return;

        const userId = user.id;
        const docRef = doc(db, "users", userId, "subscription", "details");

        const unsubscribe = onSnapshot(
          docRef,
          async (snap) => {
            try {
              if (snap.exists()) {
                setSubscription(snap.data() as SubscriptionData);
              } else {
                const newSubscription: SubscriptionData = {
                  status: "active",
                  plan: "free",
                  monthlyLimit: FREE_PLAN_LIMIT,
                  createdAt: serverTimestamp() as unknown as Date,
                  updatedAt: serverTimestamp() as unknown as Date,
                };
                await setDoc(docRef, newSubscription, { merge: true });
                setSubscription(newSubscription);
              }
            } catch (err) {
              console.error("Error processing subscription:", err);
              setError(err as Error);
            } finally {
              setLoading(false);
            }
          },
          (err) => {
            console.error("Subscription listener error:", err);
            setError(err as Error);
            setLoading(false);
          }
        );

        unsubscribeRef.current = unsubscribe;
      } catch (err) {
        if (!cancelled) {
          console.error("Error initializing subscription:", err);
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    initializeSubscription();

    return () => {
      cancelled = true;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [isLoaded, user]);

  const isPro = subscription?.plan === "pro";

  return {
    subscription,
    loading,
    error,
    isPro,
    hasActiveMembership: isPro,
    monthlyLimit: subscription?.monthlyLimit || FREE_PLAN_LIMIT,
  };
}

export default useSubscription;
