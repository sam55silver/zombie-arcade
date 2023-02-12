import CharacterController from './CharacterController';
import Bullet from './Bullet';
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

    this.isInvulnerable = false;
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

  updateCharacter(delta) {
    const angle = this.lookAt(this.hitBox.pos, this.scene.input.mousePos).angle;
    this.rotation = angle;

    if (this.scene.input.isFiring) this.fire();

    // move
    this.velocity = this.scene.input.moveDir
      .clone()
      .normalize()
      .scale(this.speed);

    this.rigidBodyCollisionCheck(SAT.testCirclePolygon, this.scene.map.walls);
  }
}

export default Player;
