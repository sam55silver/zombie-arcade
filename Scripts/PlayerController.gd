extends KinematicBody2D

var velocity = Vector2.ZERO

const MAX_SPEED = 500.0
const ACCELERATION = 100

onready var _animated_sprite = $AnimatedSprite 
onready var bullet = preload("res://Nodes/Bullet.tscn")

func _process(_delta):
	if Input.is_action_just_pressed("shoot") and _animated_sprite.get_animation() == "Idle":
		_animated_sprite.play("Shoot")
		var new_bullet = bullet.instance()
		new_bullet.transform = $Muzzle.global_transform
		get_parent().add_child(new_bullet)

func _physics_process(delta):
	look_at(get_global_mouse_position())
	
	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var direction = Vector2.ZERO
	direction.x = Input.get_axis("move_left", "move_right")
	direction.y = Input.get_axis("move_up", "move_down")
	direction = direction.normalized()
	
	if direction:
		velocity += direction * ACCELERATION  
		velocity = velocity.clamped(MAX_SPEED)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, 1000 * delta)
		
	move_and_slide(velocity)


func _on_AnimatedSprite_animation_finished():
	if(_animated_sprite.get_animation() == "Shoot"):
		_animated_sprite.play("Idle")
		
func _on_Player_got_hurt():
	$Timer.start()

func _on_Timer_timeout():
	print("done")
