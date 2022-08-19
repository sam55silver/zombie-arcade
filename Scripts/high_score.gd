extends Node2D

onready var globals = get_node("/root/Globals")

func _ready():
	var size = globals.high_scores.size()
	
	for n in 8:
		var score_index = Label.new()
		score_index.set_text("{index}.".format({"index": n + 1}))
		
		var score_name = Label.new()
		var score_score = Label.new()
		
		if size > n:
			var score = globals.high_scores[n]
			var three_char_score = globals.count_to_string(score.score)
			
			score_name.set_text(score.name)
			score_score.set_text(three_char_score)
		
		else:
			score_name.set_text("-----")
			score_score.set_text("---")
		
		$high_scores.add_child(score_index)
		$high_scores.add_child(score_name)
		$high_scores.add_child(score_score)

func _on_retryButton_button_up():
	get_tree().change_scene("res://Nodes/Scenes/game_world.tscn")

func _on_menuButton_button_up():
	get_tree().change_scene("res://Nodes/Scenes/menu.tscn")
