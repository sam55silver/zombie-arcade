import { Container, AnimatedSprite, Sprite } from 'pixi.js';
import Bullet from './Bullet';
import { normalize } from './Utility';

class Player extends Container {
  constructor(app) {
    super();

    this.app = app;

    this.x = 512 / 2;
    this.y = 512 / 2;

    this.sprite = new AnimatedSprite(
      app.spriteSheet.animations['PlayerGunShot']
    );
    this.sprite.anchor.set(0.5, 0.9);
    this.sprite.animationSpeed = 0.2;
    this.sprite.play();

    this.muzzle = new Sprite(app.spriteSheet.textures['Bullet.png']);
    this.muzzle.anchor.set(0.5);
    this.muzzle.y = -this.sprite.height / 2;

    this.addChild(this.sprite);
    // this.addChild(this.muzzle);
    // this.fire();

    this.moveDir = { 'x': 0, 'y': 0 };
    this.speed = 4;

    // input
    const moveInput = (axis, dir) => {
      const move = () => (this.moveDir[axis] = dir);
      const stop = () => (this.moveDir[axis] = 0);
      return [move, stop];
    };
    app.input.addInput('w', ...moveInput('y', -1));
    app.input.addInput('s', ...moveInput('y', 1));
    app.input.addInput('a', ...moveInput('x', -1));
    app.input.addInput('d', ...moveInput('x', 1));
  }

  fire() {
    this.app.stage.addChild(
      new Bullet(
        this.muzzle.getGlobalPosition(),
        this.app.spriteSheet.textures['Bullet.png']
      )
    );
  }

  update(delta) {
    this.rotation += 0.02 * delta;
    const moveDir = normalize(this.moveDir);
    this.x += moveDir.x * this.speed * delta;
    this.y += moveDir.y * this.speed * delta;
  }
}

export default Player;
