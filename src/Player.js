import { Container, AnimatedSprite, Sprite } from 'pixi.js';
import Bullet from './Bullet';
import { lookAt, updateContainer } from './Utility';
import SAT from 'sat';

class Player extends Container {
  constructor(app) {
    super();

    this.app = app;

    this.x = 512 / 2;
    this.y = 512 / 2;
    this.hitBox = new SAT.Circle(new SAT.Vector(this.x, this.y), 10);

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

    this.moveDir = new SAT.Vector(0, 0);
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

    this.mouseLoc = new SAT.Vector(0, 0);
  }

  onMouseMove(x, y) {
    this.mouseLoc.x = x;
    this.mouseLoc.y = y;
  }

  fire() {
    if (this.sprite.playing) return;

    this.sprite.textures = this.app.spriteSheet.animations['PlayerGunShot'];
    this.sprite.play();

    new Bullet(this.app, this.x, this.y, this.rotation);
  }

  testCollideWithWall() {
    const { hitBox } = this;
    const { walls } = this.app.map;

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      const response = new SAT.Response();
      if (SAT.testCirclePolygon(hitBox, wall, response)) {
        hitBox.pos.x -= response.overlapV.x;
        hitBox.pos.y -= response.overlapV.y;
      }
    }
  }

  update(delta) {
    const moveDir = this.moveDir.normalize();
    this.hitBox.pos.x += moveDir.x * this.speed * delta;
    this.hitBox.pos.y += moveDir.y * this.speed * delta;
    this.testCollideWithWall();
    updateContainer(this, this.hitBox.pos);

    // look at mouse
    const angle = lookAt(this.hitBox.pos, this.mouseLoc).angle;
    this.rotation = angle;
  }
}

export default Player;
