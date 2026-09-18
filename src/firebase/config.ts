import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyACAkRfsavFMdLPuFQuoA3S0hBS-4rqdjE',
  authDomain: 'icoh-payslip-original.firebaseapp.com',
  projectId: 'icoh-payslip-original',
  storageBucket: 'icoh-payslip-original.firebasestorage.app',
  messagingSenderId: '767582615230',
  appId: '1:767582615230:web:e72466cd6a7d14a7d610ef'
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;