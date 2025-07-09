import { supabase } from '../config/supabase.js'

const get_leader_board = async () => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('name, score')
      .order('score', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    // Pad results to 10 entries like the original implementation
    const scores = data || []
    while (scores.length < 10) {
      scores.push({"name": "------", "score": "N/A"})
    }

    return scores
  } catch (error) {
    console.error("Error fetching high scores from Supabase:", error)
    throw error
  }
}

export default get_leader_board
