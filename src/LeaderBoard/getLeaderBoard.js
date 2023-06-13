import { collection, getDocs } from 'firebase/firestore';

const get_leader_board = async (db) => {
  const high_scores = [];

  const querySnapshot = await getDocs(collection(db, 'high_scores'));
  querySnapshot.forEach((doc) => {
    high_scores.push(doc.data());
  });

  return high_scores;
};

export default get_leader_board;
