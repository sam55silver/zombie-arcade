import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

const get_leader_board = async (db) => {
  const high_scores = [];

  const docRef = collection(db, 'high_scores');

  const q = query(docRef, orderBy('score', 'desc'), limit(9));

  const querySnapshot = await getDocs(q).catch((error) => console.log(error));
  querySnapshot.forEach((doc) => {
    high_scores.push(doc.data());
  });

  return high_scores;
};

export default get_leader_board;
