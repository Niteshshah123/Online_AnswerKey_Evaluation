import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth as getFirebaseAuth } from 'firebase-admin/auth';

export function getFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT env variable is not set.');
  }

  let credentials;
  try {
    credentials = JSON.parse(serviceAccount);
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON.');
  }

  return initializeApp({ credential: cert(credentials) });
}

export function getAuth() {
  getFirebaseAdmin(); // ensure initialized
  return getFirebaseAuth();
}
