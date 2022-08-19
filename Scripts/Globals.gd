extends Node

var kill_count = 0

# High Score API
const API = "http://localhost:5001/zombie-arcade-api/us-central1/high_scores"
onready var http = $HTTPRequest
var high_scores = []
var high_score_location = null

func _get_high_scores():
	http.request(API)
	
func _post_high_score(name):
	var data = {"name": name, "score": kill_count}
	var query = JSON.print(data)
	
	var headers = ["Content-type: application/json"]
	
	http.request(API, headers, true, HTTPClient.METHOD_POST, query)

func _on_HTTPRequest_request_completed(result, response_code, headers, body):
	# GET REQUEST
	if response_code == 200:
		print("Getting High Scores...")
		high_scores = JSON.parse(body.get_string_from_utf8()).result
	
	# POST REQUEST
	elif response_code == 201:
		print("Posting new info!")
	
	else:
		print("Error! Received respone code: ", response_code)
		
		
# See if new high score
func _check_new_high_score():
	var size = high_scores.size()
	
	# See if the top 10 positions are filled
	for n in 10:
		if size > n:
			var score = high_scores[n]

			# If current kill count exceeds one in the top 10, set a new high score
			if kill_count > score.score:
				high_score_location = n
				return true
		
		# If there is an empty spot in the top 10, set a new high score
		else:
			high_score_location = n
			return true
	
	return false
