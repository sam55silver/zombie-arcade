import { Container, AnimatedSprite, Ticker } from 'pixi.js';
import { lookAt, normalize, vector } from './Utility';

class Zombie extends Container {
  constructor(app, type, position) {
    super();

    this.app = app;

    this.x = position.x;
    this.y = position.y;

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

  update(delta) {
    const lookAtPlayer = lookAt(
      vector(this.x, this.y),
      vector(this.app.player.x, this.app.player.y)
    );

    this.rotation = lookAtPlayer.angle;

    const moveDir = normalize(lookAtPlayer.vectorTo);
    if (moveDir.length > 30) {
      this.x += moveDir.x * this.speed * delta;
      this.y += moveDir.y * this.speed * delta;
    }
  }
}

export default Zombie;
