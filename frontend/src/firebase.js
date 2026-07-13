import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDx9Frj3HAhsTf5FfqHlMIPDzcCRXkYIeU',
  authDomain: 'evalpro-7e63f.firebaseapp.com',
  projectId: 'evalpro-7e63f',
  storageBucket: 'evalpro-7e63f.firebasestorage.app',
  messagingSenderId: '100904567720',
  appId: '1:100904567720:web:f4c9fe24cf8669cf2ed39d',
  measurementId: 'G-SBRM1SRN2X',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
