import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export const get_high_scores = async () => {
  const high_scores = [];
  const querySnapshot = await getDocs(collection(db, 'high_scores'));
  querySnapshot.forEach((doc) => {
    high_scores.push(doc.data());
  });
  return high_scores;
};
