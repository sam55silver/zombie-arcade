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

    this.lookAtPlayer();

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
      this.app.zombies = this.app.zombies.filter((zombie) => zombie !== this);
      this.destroy();
    }
  }

  lookAtPlayer() {
    const lookAtPlayer = lookAt(this.hitBox.pos, this.app.player.hitBox.pos);
    this.rotation = lookAtPlayer.angle;

    return lookAtPlayer;
  }

  testCollideWithZombies() {
    const { hitBox, sprite } = this;

    // Get all zombies except this one
    const zombies = this.app.zombies.filter((zombie) => zombie !== this);

    // Test collision with all other zombies
    for (let i = 0; i < zombies.length; i++) {
      const response = new SAT.Response();
      if (SAT.testCircleCircle(hitBox, zombies[i].hitBox, response)) {
        const posToMove = response.a.pos.sub(response.overlapV);

        hitBox.pos.x = posToMove.x;
        hitBox.pos.y = posToMove.y;
      }
    }
  }

  update(delta) {
    const { hitBox } = this;

    const moveDir = this.lookAtPlayer().vectorTo.normalize();

    const response = new SAT.Response();
    if (!SAT.testCircleCircle(hitBox, this.app.player.hitBox, response)) {
      hitBox.pos.x += moveDir.x * this.speed * delta;
      hitBox.pos.y += moveDir.y * this.speed * delta;
    } else {
      // TODO: add player hit here
      const posToMove = response.a.pos.sub(response.overlapV);
      hitBox.pos.x = posToMove.x;
      hitBox.pos.y = posToMove.y;
    }

    this.testCollideWithZombies();
    updateContainer(this, hitBox.pos);
  }
}

export default Zombie;
