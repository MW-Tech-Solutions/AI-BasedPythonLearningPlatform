import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfOXpW1iwvI9CUdlx-76Vl5ePlFCWx8Xk",
  authDomain: "pyroutes-88ros.firebaseapp.com",
  projectId: "pyroutes-88ros",
  storageBucket: "pyroutes-88ros.firebasestorage.app",
  messagingSenderId: "967827192083",
  appId: "1:967827192083:web:45333f103b30e4e45702e6"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
