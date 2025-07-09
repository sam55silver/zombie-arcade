import { supabase } from '../config/supabase.js'

const post_leader_board = async (name, score) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .insert({ name: name, score: score })
      .select()

    if (error) {
      throw error
    }

    return `Score posted successfully!`
  } catch (error) {
    console.error("Error posting score to Supabase:", error)
    throw error
  }
}

export default post_leader_board
