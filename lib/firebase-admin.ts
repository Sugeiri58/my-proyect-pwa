// lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const sa = process.env.FIREBASE_SERVICE_ACCOUNT as string; 

if (!sa) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT not set');
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(JSON.parse(sa)),
    });

export const db = getFirestore(app);
