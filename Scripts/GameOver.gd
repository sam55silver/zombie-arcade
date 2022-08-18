extends Node2D


func _on_retryButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/game_world.tscn")

func _on_menuButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/menu.tscn")
