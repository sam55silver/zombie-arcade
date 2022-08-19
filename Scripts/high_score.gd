extends Node2D

onready var globals = get_node("/root/Globals")

func _ready():
	var size = globals.high_scores.size()
	
	for n in 8:
		var score_label = Label.new()
		var score_string = "{index}. ".format({"index": n + 1})
		
		if size > n:
			var score = globals.high_scores[n]
			var three_char_score = globals.count_to_string(score.score)
			score_label.set_text(score_string + "{name}------------{score}".format({"name": score.name, "score": three_char_score}))
		
		else:
			score_label.set_text(score_string + "---------------------")
		
		$high_scores.add_child(score_label)

func _on_retryButton_button_up():
	get_tree().change_scene("res://Nodes/Scenes/game_world.tscn")

func _on_menuButton_button_up():
	get_tree().change_scene("res://Nodes/Scenes/menu.tscn")
