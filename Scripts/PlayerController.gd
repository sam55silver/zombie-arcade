extends CharacterBody2D

const MAX_SPEED = 300.0
const ACCELERATION = 100

signal got_kill()
signal got_hurt()

func _process(_delta):
	if Input.is_action_just_pressed("shoot"):
		emit_signal("got_kill")
		emit_signal("got_hurt")

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
		velocity = velocity.limit_length(MAX_SPEED)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, 1000 * delta)
		

	move_and_slide()
