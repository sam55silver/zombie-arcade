extends Node2D

onready var globals = get_node("/root/Globals")

func _ready():
	globals.kill_count = 110
	
	var data = {"name": "SAM", "score": globals.kill_count}
	var query = JSON.print(data)
	
	var headers = ["Content-type: application/json"]
	
	$HTTPRequest.request("http://localhost:5001/zombie-arcade-api/us-central1/high_scores", headers, true, HTTPClient.METHOD_POST, query)

		
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
#	var scores = JSON.parse(body.get_string_from_utf8()).result
#
#	var size = scores.size()
#
#	for n in 10:
#		if size > n:
#			var score = scores[n]
#
#			if globals.kill_count > score.score:
#				_new_high_score()
#				scores.insert(n, {"name": "SAM", "score": globals.kill_count})
#				break
#		else:
#			print("space is empty, adding in")
#			_new_high_score()
#			scores.insert(n, {"name": "SAM", "score": globals.kill_count})
#			break
#
#	for score in scores:
#		print("Name: ", score.name, ", Score: ", score.score)
