import { Container, AnimatedSprite, Sprite } from 'pixijs';
import Bullet from './Bullet';

class Player extends Container {
  constructor(app, spriteSheet) {
    super();

    this.app = app;
    this.spriteSheet = spriteSheet;

    this.x = 512 / 2;
    this.y = 512 / 2;

    this.sprite = new AnimatedSprite(spriteSheet.animations['PlayerGunShot']);
    this.sprite.anchor.set(0.5, 0.9);
    this.sprite.animationSpeed = 0.2;
    this.sprite.play();

    this.muzzle = new Sprite(spriteSheet.textures['Bullet.png']);
    this.muzzle.anchor.set(0.5);
    this.muzzle.y = -this.sprite.height / 2;

    this.addChild(this.sprite);
    // this.addChild(this.muzzle);
    this.fire();
  }

  fire() {
    this.app.stage.addChild(
      new Bullet(this.muzzle, this.spriteSheet.textures['Bullet.png'])
    );
  }

  update(delta) {
    this.rotation += 0.02 * delta;
  }
}

export default Player;
