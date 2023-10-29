const get_leader_board = async () => {
  const uri = import.meta.env.PROD ? 'https://zombies.samsilver.ca' : 'http://localhost:8070'
  const endpoint = uri + "/leaderboard"

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const highScores = await response.json();
    while (highScores.scores.length < 10) {
      highScores.scores.push({"name": "-----", "score": "N/A"})
    }

    return highScores.scores;
  } catch (error) {
    console.error("Error fetching high scores:", error);
    throw error;
  }
};

export default get_leader_board;
