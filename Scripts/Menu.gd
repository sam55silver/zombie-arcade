extends Node2D



func _on_playButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/game_world.tscn")


func _on_storyButton_pressed():
	pass # Replace with function body.


func _on_fullscreenButton_pressed():
	OS.window_fullscreen = !OS.window_fullscreen


func _on_creditsButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/credits.tscn")

func _on_exitButton_pressed():
	get_tree().quit()
