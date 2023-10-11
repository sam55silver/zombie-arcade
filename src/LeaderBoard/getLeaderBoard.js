const get_leader_board = async () => {
  const endpoint = 'http://localhost:8070/leaderboard'

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const highScores = await response.json();
    return highScores.scores;
  } catch (error) {
    console.error("Error fetching high scores:", error);
    throw error;
  }
};

export default get_leader_board;
