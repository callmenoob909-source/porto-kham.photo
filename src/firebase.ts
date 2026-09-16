import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Use named firestoreDatabaseId from config if provided
export const db: Firestore = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || '(default)');

export default app;
