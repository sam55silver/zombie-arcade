extends Node2D

onready var globals = get_node("/root/Globals")

func _ready():
	$kill_count.set_text(str(globals.kill_count))

func _on_submit_button_up():
	var name = $name_input.get_text() 
	globals._post_high_score(name)
