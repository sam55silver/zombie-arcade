import CharacterController from './CharacterController';
import { lookAt } from './Utility';
import SAT from 'sat';

class Zombie extends CharacterController {
  constructor(app, type, position) {
    super(
      app,
      position,
      15,
      [app.spriteSheet.textures[`zombie-${type}.png`]],
      { x: 0.5, y: 0.9 },
      1,
      2
    );

    this.app = app;
    this.dead = false;

    this.lookAtPlayer();
  }

  deathCallback() {
    this.dead = true;
    this.app.killCount.update();

    // Play death animation
    // this.velocity = new SAT.Vector(0, 0);
    // this.sprite.textures = this.app.spriteSheet.animations['zombie-death'];
    // this.sprite.animationSpeed = 0.1;
    // this.sprite.play();

    // console.log('Zombie died', this.velocity);
    this.app.zombies = this.app.zombies.filter((zombie) => zombie !== this);
  }

  lookAtPlayer() {
    const lookAtPlayer = lookAt(this.hitBox.pos, this.app.player.hitBox.pos);
    this.rotation = lookAtPlayer.angle;

    return lookAtPlayer;
  }

  testCollideWithZombies() {
    const { hitBox } = this;

    // Test collision with all other zombies
    for (let i = 0; i < this.app.zombies.length; i++) {
      // If this is the same zombie, skip
      if (this.app.zombies[i] == this) continue;

      // Soft body collision a check
      const response = new SAT.Response();
      if (SAT.testCircleCircle(hitBox, this.app.zombies[i].hitBox, response)) {
        this.velocity = this.velocity.sub(response.overlapV.scale(0.2));
      }
    }
  }

  updateCharacter(delta) {
    if (!this.dead) {
      this.velocity = this.lookAtPlayer()
        .vectorTo.normalize()
        .scale(this.speed);

      this.rigidBodyCollisionCheck(
        SAT.testCircleCircle,
        this.app.player.hitBox,
        () => {
          this.app.player.getHit();
        }
      );
      this.testCollideWithZombies();
    }
  }
}

export default Zombie;
