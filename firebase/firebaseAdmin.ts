import {
  initializeApp,
  getApps,
  getApp,
  App,
  cert,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Build the service-account credential from environment variables.
// Works identically on Vercel and locally — no service_key.json file is read,
// so the bundle never depends on a gitignored file that is absent in production.
function getServiceAccount() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Private keys are stored with literal "\n" sequences in env vars.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are missing. Set FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  return { projectId, clientEmail, privateKey };
}

// Lazy singletons so the credential is only assembled when Firebase Admin is
// actually used at request time — never during the Next.js build's page-data
// collection, where env vars may be unavailable.
let _app: App | undefined;
let _adminDb: Firestore | undefined;

function getAdminApp(): App {
  if (_app) return _app;
  _app = getApps().length > 0
    ? getApp()
    : initializeApp({ credential: cert(getServiceAccount()) });
  return _app;
}

export function getAdminDb(): Firestore {
  if (!_adminDb) {
    _adminDb = getFirestore(getAdminApp());
  }
  return _adminDb;
}

// Backwards-compatible exports. `adminDb` is a lazy proxy so existing call sites
// (`adminDb.collection(...)`) keep working without touching Firestore at import time.
export const adminApp = new Proxy({} as App, {
  get(_t, prop) {
    return (getAdminApp() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const adminDb = new Proxy({} as Firestore, {
  get(_t, prop) {
    return (getAdminDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
