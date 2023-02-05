import { Graphics } from 'pixi.js';
import CharacterController from './CharacterController';
import Bullet from './Bullet';
import { lookAt } from './Utility';
import SAT from 'sat';

class Player extends CharacterController {
  constructor(app) {
    super(
      app,
      { x: 512 / 2, y: 512 / 2 },
      6,
      app.spriteSheet.animations['player-gunshot-anim'],
      { x: 0.5, y: 0.9 },
      4,
      5
    );

    this.app = app;

    this.moveDir = new SAT.Vector(0, 0);
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

    this.isInvulnerable = false;
  }

  onMouseMove(x, y) {
    this.mouseLoc.x = x;
    this.mouseLoc.y = y;
  }

  getHit() {
    if (this.isInvulnerable) return;

    // Make player invulnerable for a short time
    this.sprite.tint = 0xff0000;
    this.sprite.alpha = 0.5;
    this.isInvulnerable = true;
    setTimeout(() => {
      this.sprite.tint = 0xffffff;
      this.sprite.alpha = 1;
      this.isInvulnerable = false;
    }, 1000);

    this.hit();
  }

  fire() {
    if (this.sprite.playing) return;

    this.sprite.textures =
      this.app.spriteSheet.animations['player-gunshot-anim'];
    this.sprite.play();

    new Bullet(this.app, this.x, this.y, this.rotation);
  }

  lookAtMouse() {
    // look at mouse
    const angle = lookAt(this.hitBox.pos, this.mouseLoc).angle;
    this.rotation = angle;
  }

  update(delta) {
    // move
    this.velocity = this.moveDir.clone().normalize().scale(this.speed);

    this.rigidBodyCollisionCheck(SAT.testCirclePolygon, this.app.map.walls);
    this.lookAtMouse();
  }
}

export default Player;
