import { Container, AnimatedSprite, Graphics } from 'pixi.js';
import SAT from 'sat';

class CharacterController extends Container {
  constructor(scene, pos, hitBoxRadius, sprite, origin, speed) {
    super();

    this.x = pos.x;
    this.y = pos.y;
    this.hitBox = new SAT.Circle(new SAT.Vector(this.x, this.y), hitBoxRadius);

    this.sprite = new AnimatedSprite(sprite);
    this.sprite.loop = false;
    this.sprite.gotoAndStop(sprite.length - 1);
    this.sprite.anchor.set(origin.x, origin.y);
    this.sprite.scale.set(2);
    this.sprite.animationSpeed = 0.2;
    this.addChild(this.sprite);

    // Collision debug
    // const obj = new Graphics();
    // obj.beginFill(0xff0000);
    // obj.drawCircle(0, 0, hitBoxRadius);
    // this.addChild(obj);

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

  update(delta) {
    if (this.updateCharacter) this.updateCharacter(delta);
    this.x += this.velocity.x * delta;
    this.y += this.velocity.y * delta;
    this.hitBox.pos.x = this.x;
    this.hitBox.pos.y = this.y;
  }
}

export default CharacterController;
