import { Container, AnimatedSprite, Graphics } from 'pixi.js';
import SAT from 'sat';

class CharacterController extends Container {
  constructor(scene, pos, hitBoxRadius, sprite, origin, speed) {
    super();

    this.x = pos.x;
    this.y = pos.y;
    this.scene = scene;

    this.hitBox = new SAT.Circle(
      new SAT.Vector(this.scene.game.x + this.x, this.scene.game.y + this.y),
      hitBoxRadius * scene.spriteScale
    );

    this.sprite = new AnimatedSprite(sprite);
    this.sprite.loop = false;
    this.sprite.gotoAndStop(sprite.length - 1);
    this.sprite.anchor.set(origin.x, origin.y);
    this.sprite.scale.set(scene.spriteScale);
    this.sprite.animationSpeed = 0.2;
    this.addChild(this.sprite);

    if (scene.debug) {
      this.debug = new Graphics();
      this.debug.beginFill(0xff0000, 0.5);
      this.debug.drawCircle(
        this.hitBox.pos.x,
        this.hitBox.pos.y,
        this.hitBox.r
      );
      this.debug.endFill();
      scene.debug.addChild(this.debug);
    }

    this.speed = speed;
    this.velocity = new SAT.Vector(0, 0);

    scene.gameArea.addChild(this);
  }

  setHitBoxOffset(offset) {
    this.hitBoxOffset = offset;
    this.hitBoxOffset.x *= this.scene.spriteScale;
    this.hitBoxOffset.y *= this.scene.spriteScale;
  }

  rigidBodyCollisionCheck(type, collisionObjects, callback) {
    // Rigid body collision check
    // Check where player is going to move for collision
    const newHitBox = new SAT.Circle(
      new SAT.Vector(
        this.hitBox.pos.x + this.velocity.x,
        this.hitBox.pos.y + this.velocity.y
      ),
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
      if (this.debug) this.debug.destroy();
      return;
    }
    this.x += this.velocity.x * this.speed * delta;
    this.y += this.velocity.y * this.speed * delta;
    this.hitBox.pos.x = this.scene.game.x + this.x;
    this.hitBox.pos.y = this.scene.game.y + this.y;

    if (this.hitBoxOffset) {
      const angle = this.rotation - Math.PI / 2;
      const offset = {
        x: Math.cos(angle) * this.hitBoxOffset.x,
        y: Math.sin(angle) * this.hitBoxOffset.y,
      };
      this.hitBox.pos.x += offset.x;
      this.hitBox.pos.y += offset.y;
    }

    if (this.debug) {
      this.debug.clear();
      this.debug.beginFill(0xff0000, 0.5);
      this.debug.drawCircle(
        this.hitBox.pos.x,
        this.hitBox.pos.y,
        this.hitBox.r
      );
      this.debug.endFill();
    }
  }
}

export default CharacterController;
