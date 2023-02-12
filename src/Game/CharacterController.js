import { Container, AnimatedSprite } from 'pixi.js';
import SAT from 'sat';

class CharacterController extends Container {
  constructor(
    scene,
    pos,
    { hitBoxRadius, hitBoxOffset },
    sprite,
    origin,
    speed
  ) {
    super();

    this.x = pos.x;
    this.y = pos.y;
    this.hitBox = new SAT.Circle(
      new SAT.Vector(this.x, this.y),
      hitBoxRadius * scene.spriteScale
    );
    this.hitBoxOffset = hitBoxOffset;

    this.sprite = new AnimatedSprite(sprite);
    this.sprite.loop = false;
    this.sprite.gotoAndStop(sprite.length - 1);
    this.sprite.anchor.set(origin.x, origin.y);
    this.sprite.scale.set(scene.spriteScale);
    this.sprite.animationSpeed = 0.2;
    this.addChild(this.sprite);

    this.speed = speed;
    this.velocity = new SAT.Vector(0, 0);

    scene.gameArea.addChild(this);
  }

  rigidBodyCollisionCheck(type, collisionObjects, callback) {
    // Rigid body collision check
    // Check where player is going to move for collision
    const newHitBox = new SAT.Circle(
      new SAT.Vector(this.x + this.velocity.x, this.y + this.velocity.y),
      this.hitBox.r
    );

    const checkCollide = (obj) => {
      const response = new SAT.Response();
      if (type(newHitBox, obj, response)) {
        this.velocity = this.velocity.sub(response.overlapV);
        if (callback) callback();

        return true;
      }
      return false;
    };

    // Check if there are multiple collision objects
    const len = collisionObjects.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        checkCollide(collisionObjects[i]);
      }
    } else {
      checkCollide(collisionObjects);
    }
  }

  lookAt = (v1, v2) => {
    const vectorTo = v2.clone().sub(v1.clone());
    const angle = Math.atan2(vectorTo.y, vectorTo.x) + Math.PI / 2;

    return { angle, vectorTo };
  };

  update(delta) {
    if (this.updateCharacter) this.updateCharacter(delta);
    if (this.dead) {
      this.destroy({ children: true });
      return;
    }
    this.x += this.velocity.x * this.speed * delta;
    this.y += this.velocity.y * this.speed * delta;
    this.hitBox.pos.x = this.x;
    this.hitBox.pos.y = this.y;
  }
}

export default CharacterController;
