import { auth } from "@clerk/nextjs/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create a Firebase custom token using the Clerk user ID
    const firebaseAuth = getAuth(adminApp);
    const customToken = await firebaseAuth.createCustomToken(userId);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Error creating Firebase token:", error);
    return NextResponse.json(
      { error: "Failed to create Firebase token" },
      { status: 500 }
    );
  }
}
