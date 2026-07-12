import admin from 'firebase-admin';

let firebaseAdmin;

export function getFirebaseAdmin() {
  if (firebaseAdmin) return firebaseAdmin;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT env variable is not set.');
  }

  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
  });

  return firebaseAdmin;
}

export function getAuth() {
  getFirebaseAdmin(); // ensure initialized
  return admin.auth();
}
