import {
  initializeApp,
  getApps,
  getApp,
  App,
  cert,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

if (getApps().length === 0) {
  if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
    // Production / Vercel: credentials from environment variables
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // Vercel stores private keys with literal \n sequences
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // Local development: credentials from service key file (gitignored)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceKey = require("../service_key.json");
    app = initializeApp({ credential: cert(serviceKey) });
  }
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
