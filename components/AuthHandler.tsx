'use client';

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { initUserSubscription } from "@/lib/initSubscription";

export function AuthHandler() {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      initUserSubscription(userId).catch(console.error);
    }
  }, [isLoaded, userId]);

  return null;
}