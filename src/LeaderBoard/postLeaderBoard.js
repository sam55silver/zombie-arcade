import { collection, addDoc, Timestamp } from 'firebase/firestore';

const post_leader_board = (db, name, score) => {
  const docRef = collection(db, 'high_scores');

  const entry = {
    name: name,
    score: score,
    createdAt: new Date(),
  };

  return addDoc(docRef, entry);
};

export default post_leader_board;
