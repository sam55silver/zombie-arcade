extends HBoxContainer

onready var globals = get_node("/root/Globals")
var number_array = [preload("res://Art/Death Screen/Death Screen Font/DS0.png"), preload("res://Art/Death Screen/Death Screen Font/DS1.png"), preload("res://Art/Death Screen/Death Screen Font/DS2.png"), preload("res://Art/Death Screen/Death Screen Font/DS3.png"), preload("res://Art/Death Screen/Death Screen Font/DS4.png"), preload("res://Art/Death Screen/Death Screen Font/DS5.png"), preload("res://Art/Death Screen/Death Screen Font/DS6.png"),preload("res://Art/Death Screen/Death Screen Font/DS7.png"), preload("res://Art/Death Screen/Death Screen Font/DS8.png"), preload("res://Art/Death Screen/Death Screen Font/DS9.png")]

func _ready():
	var count_string = str(globals.kill_count)
	
	if(count_string.length() == 1):
		count_string = "00" + count_string
	elif (count_string.length() == 2):
		count_string = "0" + count_string
	
	get_child(0).texture = number_array[count_string[0].to_int()]
	get_child(1).texture = number_array[count_string[1].to_int()]
	get_child(2).texture = number_array[count_string[2].to_int()]
