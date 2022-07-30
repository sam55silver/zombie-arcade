extends Area2D

var speed = 1200

func _physics_process(delta):
	position += transform.x * speed * delta
	
func _on_Bullet_body_entered(body):
	if body.is_in_group("mobs"):
		body.hit_by_bullet()

func _on_Timer_timeout():
	self.queue_free()
