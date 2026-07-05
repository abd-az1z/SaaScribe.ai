// lib/firebase-auth.ts
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getApp } from "firebase/app";

export async function signInToFirebase(token: string) {
  const auth = getAuth(getApp());
  if (token) {
    await signInWithCustomToken(auth, token);
  }
  return auth;
}