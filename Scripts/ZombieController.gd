extends KinematicBody2D

onready var player = get_parent().get_node("Player")

signal got_kill()
signal hurt_player()

var life = 2
var speed = 100

var in_player = false

var velocity = Vector2.ZERO

func _ready():
	var health = get_node("../UI/HealthContainer")
	self.connect("hurt_player", health, "_on_Player_got_hurt")
	
	var player = get_node("../Player")
	self.connect("hurt_player", player, "_on_Player_got_hurt")
	
	var kills = get_node("../UI/KillCount")
	self.connect("got_kill", kills, "_on_Player_got_kill")
	
func _process(delta):
	if in_player:
		emit_signal("hurt_player")
	
func _physics_process(delta):
	look_at(player.global_position)
	velocity = Vector2(speed, 0).rotated(rotation)
	
	move_and_slide(velocity)

func hit_by_bullet():
	life = life - 1
	if life == 0:
		emit_signal("got_kill")
		self.queue_free()

func _on_Area2D_body_entered(body):
	if body.is_in_group("player"):
		in_player = true


func _on_Area2D_body_exited(body):
	if body.is_in_group("player"):
		in_player = false
