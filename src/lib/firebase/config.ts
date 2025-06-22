import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Verificar que tenemos todas las variables de entorno necesarias
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase config error: Faltan variables de entorno requeridas');
  console.log('Config actual:', {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    storageBucket: !!firebaseConfig.storageBucket,
    messagingSenderId: !!firebaseConfig.messagingSenderId,
    appId: !!firebaseConfig.appId
  });
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log('Firebase App inicializado');

// Initialize services
const auth = getAuth(app);
console.log('Firebase Auth inicializado');

const firestore = getFirestore(app);
console.log('Firebase Firestore inicializado');

const storage = getStorage(app);
console.log('Firebase Storage inicializado');

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence configurada a LOCAL');
  })
  .catch((error) => {
    console.error('Error configurando persistencia de Auth:', error);
  });

// Initialize Analytics in production only
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  isSupported().then(yes => {
    if (yes) {
        analytics = getAnalytics(app);
      console.log('Firebase Analytics inicializado');
    }
  });
}

export { app, auth, firestore, storage, analytics };