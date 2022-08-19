extends Node2D

onready var globals = get_node("/root/Globals")

func _ready():
	globals.kill_count = 110
	


		
#	$HTTPRequest.request("http://localhost:5001/zombie-arcade-api/us-central1/high_scores")

func _on_retryButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/game_world.tscn")

func _on_menuButton_pressed():
	get_tree().change_scene("res://Nodes/Scenes/menu.tscn")

func _new_high_score():
	print("New highscore of ", globals.kill_count)

func _on_HTTPRequest_request_completed(result, response_code, headers, body):
	print("result ", result)
	print("response_code ", response_code)
	print("headers ", headers)
	print("body ", body)

