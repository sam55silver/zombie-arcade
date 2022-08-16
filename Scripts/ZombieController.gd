extends KinematicBody2D

onready var player = get_parent().get_node("Player")
onready var _animated_sprite = $AnimatedSprite 

signal got_kill()
signal inside_player()

var life = 2
var speed = 100

var in_player = false
var dead = false

var velocity = Vector2.ZERO

func _ready():
	randomize()
	if randf() > 0.5:
		_animated_sprite.play("Female")
	else:
		_animated_sprite.play("Male")
	
	var player = get_node("../Player")
	self.connect("inside_player", player, "_on_Player_Zombie_Collide")
	
	var kills = get_node("../UI/KillCount")
	self.connect("got_kill", kills, "_on_Player_got_kill")
	
func _process(delta):
	if in_player:
		emit_signal("inside_player")
	
func _physics_process(delta):
	if !dead:
		look_at(player.global_position)
		velocity = Vector2(speed, 0).rotated(rotation)
		
		move_and_slide(velocity)

func hit_by_bullet():
	life = life - 1
	if life == 0:
		dead = true
		emit_signal("got_kill")

		$CollisionShape2D.queue_free()
		$Area2D.queue_free()
		_Set_Animation(Vector2(0,-8), "Death")

func _on_Area2D_body_entered(body):
	if body.is_in_group("player"):
		in_player = true


func _on_Area2D_body_exited(body):
	if body.is_in_group("player"):
		in_player = false


func _on_AnimatedSprite_animation_finished():
	if _animated_sprite.get_animation() == "Death":
		self.queue_free()
		
		
func _on_Player_Die():
	_Set_Animation(Vector2(0,-12), "Fade")
		
		
func _Set_Animation(offset : Vector2, anim : String):
	self.set_z_index(0)
	_animated_sprite.set_offset(offset)
	_animated_sprite.play(anim)
