import { Container, AnimatedSprite, Ticker, Graphics } from 'pixi.js';
import { lookAt, updateContainer } from './Utility';
import SAT from 'sat';

class Zombie extends Container {
  constructor(app, type, position) {
    super();

    this.app = app;

    this.x = position.x;
    this.y = position.y;
    this.hitBox = new SAT.Circle(new SAT.Vector(this.x, this.y), 15);

    this.health = 2;
    this.speed = 1;

    this.sprite = new AnimatedSprite([
      app.spriteSheet.textures[`ZombieDesign${type}.png`],
    ]);
    this.sprite.anchor.set(0.5, 0.9);
    this.sprite.stop();
    this.addChild(this.sprite);

    this.ticker = Ticker.shared;
    this.ticker.add(this.update, this);
  }

  hit() {
    this.health -= 1;
    if (this.health <= 0) {
      this.ticker.remove(this.update, this);
      this.destroy();
    }
  }

  update(delta) {
    const lookAtPlayer = lookAt(this.hitBox.pos, this.app.player.hitBox.pos);

    this.rotation = lookAtPlayer.angle;

    const moveDir = lookAtPlayer.vectorTo.normalize();
    if (!SAT.testCircleCircle(this.app.player.hitBox, this.hitBox)) {
      this.hitBox.pos.x += moveDir.x * this.speed * delta;
      this.hitBox.pos.y += moveDir.y * this.speed * delta;
      updateContainer(this, this.hitBox.pos);
    }
  }
}

export default Zombie;
