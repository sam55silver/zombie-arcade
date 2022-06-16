extends HBoxContainer

var kill_count = 0

var number_array = [preload("res://Art/Kills UI/KillsUI - 0.png"), preload("res://Art/Kills UI/KillsUI - 1.png"), preload("res://Art/Kills UI/KillsUI - 2.png"), preload("res://Art/Kills UI/KillsUI - 3.png"), preload("res://Art/Kills UI/KillsUI - 4.png"), preload("res://Art/Kills UI/KillsUI - 5.png"), preload("res://Art/Kills UI/KillsUI - 6.png"),preload("res://Art/Kills UI/KillsUI - 7.png"), preload("res://Art/Kills UI/KillsUI - 8.png"), preload("res://Art/Kills UI/KillsUI - 9.png")]

func count_to_string():
	var count_string = str(kill_count)
	
	if(count_string.length() == 1):
		count_string = "00" + count_string
	elif (count_string.length() == 2):
		count_string = "0" + count_string

	return count_string

func update_kill_count():
	kill_count += 1;
	var count_string = count_to_string()
	
	get_child(0).texture = number_array[count_string[0].to_int()]
	get_child(1).texture = number_array[count_string[1].to_int()]
	get_child(2).texture = number_array[count_string[2].to_int()]


func _on_player_got_kill():
	update_kill_count()
