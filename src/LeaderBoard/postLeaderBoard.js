const post_leader_board = async (name, score) => {
  const endpoint = window.location.href + "/leaderboard"

  const entry = {
    name: name,
    score: score,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(entry), // Convert the data to JSON format
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse the response JSON
    return responseData.message;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};

export default post_leader_board;
