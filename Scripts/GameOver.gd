extends Node2D

onready var globals = get_node("/root/Globals")

func _ready():
	globals.kill_count = 110

func _on_retryButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/game_world.tscn")

func _on_menuButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/menu.tscn")
