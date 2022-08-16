extends HBoxContainer

var health = 8;

var heart_full = preload("res://Art/Health UI/HealthUI -Health Unit.png")
var heart_empty = preload("res://Art/Health UI/HealthUI - Empty Health Unit.png")

# Called when the node enters the scene tree for the first time.
func _ready():
	health = 8

func get_hit():
	health -= 1
	
	for i in get_child_count():
		if health > i:
			get_child(i).texture = heart_full
		else:
			get_child(i).texture = heart_empty
			
	if health < 1:
		player_dead()

func player_dead():
	get_tree().call_group("playerDeadListeners", "_on_Player_Die")

func _on_Player_got_hurt():
	get_hit()
