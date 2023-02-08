import { Sprite } from 'pixi.js';
import CharacterController from './CharacterController';
import Bullet from './Bullet';
import { lookAt } from './Utility';
import SAT from 'sat';

class Player extends CharacterController {
  constructor(scene) {
    super(
      scene,
      { x: 0, y: 0 },
      6,
      scene.spriteSheet.animations['player-gunshot-anim'],
      { x: 0.5, y: 0.9 },
      4,
      5
    );

    this.scene = scene;

    this.maxHealth = 8;
    this.timesHit = 0;

    this.reticle = new Sprite(scene.spriteSheet.animations['reticle'][0]);
    this.reticle.anchor.set(0.5);
    this.reticle.scale.set(scene.spriteScale);
    scene.game.addChild(this.reticle);

    this.moveDir = new SAT.Vector(0, 0);
    this.mouseLoc = new SAT.Vector(0, 0);

    this.isInvulnerable = false;
  }

  onMouseMove(x, y) {
    this.mouseLoc.x = x;
    this.mouseLoc.y = y;
  }

  hit() {
    if (this.isInvulnerable || this.timesHit >= this.maxHealth) return;

    this.timesHit++;
    this.scene.playerHealth.update();

    if (this.timesHit >= this.maxHealth) {
      // TO-DO: Add death animation here
      console.log('Game Over');
    } else {
      // Make player invulnerable for a short time
      this.sprite.tint = 0xff0000;
      this.sprite.alpha = 0.5;
      this.isInvulnerable = true;
      setTimeout(() => {
        this.sprite.tint = 0xffffff;
        this.sprite.alpha = 1;
        this.isInvulnerable = false;
      }, 1000);
    }
  }

  fire() {
    if (this.sprite.playing) return;

    this.sprite.textures =
      this.scene.spriteSheet.animations['player-gunshot-anim'];
    this.sprite.play();

    new Bullet(this.scene, this.x, this.y, this.rotation);
  }

  lookAtMouse() {
    // look at mouse
    const angle = lookAt(this.hitBox.pos, this.scene.input.mousePos).angle;
    this.rotation = angle;
  }

  updateCharacter(delta) {
    // Reset movement
    // TO-DO: add mobile versions here
    // this.moveDir.y = 0;
    // this.moveDir.x = 0;

    // Check inputs
    // for (let input in this.scene.input.pressed) {
    //   switch (this.scene.input.pressed[input]) {
    //     case 'up':
    //       this.moveDir.y = -1;
    //       break;
    //     case 'down':
    //       this.moveDir.y = 1;
    //       break;
    //     case 'left':
    //       this.moveDir.x = -1;
    //       break;
    //     case 'right':
    //       this.moveDir.x = 1;
    //       break;
    //     case 'fire':
    //       this.fire();
    //       break;
    //     default:
    //       break;
    //   }
    // }

    this.rotation = Math.atan(
      this.scene.input.mousePos.y / this.scene.input.mousePos.x
    );
    if (this.scene.input.mousePos.x < 0) {
      this.rotation += Math.PI;
    }

    this.rotation += (90 * Math.PI) / 180;

    // move
    this.velocity = this.scene.input.moveDir
      .clone()
      .normalize()
      .scale(this.speed);

    const deg = this.rotation - (90 * Math.PI) / 180;
    this.reticle.x = Math.cos(deg) * 100 + this.x + this.velocity.x * delta;
    this.reticle.y = Math.sin(deg) * 100 + this.y + this.velocity.y * delta;

    this.rigidBodyCollisionCheck(SAT.testCirclePolygon, this.scene.map.walls);

    // this.reticle.x = this.scene.input.mousePos.x;
    // this.reticle.y = this.scene.input.mousePos.y;

    // this.lookAtMouse();
  }
}

export default Player;
