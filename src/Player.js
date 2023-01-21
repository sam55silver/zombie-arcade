import { Container, AnimatedSprite, Sprite } from 'pixi.js';
import Bullet from './Bullet';
import { lookAt, normalize, vector } from './Utility';

class Player extends Container {
  constructor(app) {
    super();

    this.app = app;

    this.x = 512 / 2;
    this.y = 512 / 2;

    this.sprite = new AnimatedSprite(
      app.spriteSheet.animations['PlayerGunShot']
    );
    this.sprite.loop = false;
    this.sprite.gotoAndStop(
      app.spriteSheet.animations['PlayerGunShot'].length - 1
    );
    this.sprite.anchor.set(0.5, 0.9);

    this.sprite.animationSpeed = 0.2;

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

    app.input.addMouseMovement(app.view, this.onMouseMove.bind(this));
    app.input.addMouseInput(app.view, this.fire.bind(this));
  }

  onMouseMove(mouseLoc) {
    const angle = lookAt(vector(this.x, this.y), mouseLoc).angle;
    this.rotation = angle;
  }

  fire() {
    if (this.sprite.playing) return;

    this.sprite.textures = this.app.spriteSheet.animations['PlayerGunShot'];
    this.sprite.play();

    const bullet = new Bullet(this.app, this.x, this.y, this.rotation);
  }

  update(delta) {
    const moveDir = normalize(this.moveDir);
    this.x += moveDir.x * this.speed * delta;
    this.y += moveDir.y * this.speed * delta;
  }
}

export default Player;
