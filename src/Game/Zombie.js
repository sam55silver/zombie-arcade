import CharacterController from './CharacterController';
import SAT from 'sat';

class Zombie extends CharacterController {
  constructor(scene, type, position) {
    super(
      scene,
      position,
      { hitBoxRadius: 6, hitBoxOffset: { x: 0, y: 0 } },
      [scene.spriteSheet.textures[`zombie-${type}.png`]],
      { x: 0.5, y: 0.9 },
      1,
      2
    );

    this.scene = scene;

    this.health = 2;

    this.lookAtPlayer();
  }

  hit() {
    this.health--;
    if (this.health <= 0) {
      this.scene.killCount.update();

      this.scene.zombies = this.scene.zombies.filter(
        (zombie) => zombie !== this
      );

      this.dead = true;
    }
  }

  lookAtPlayer() {
    const lookAtPlayer = this.lookAt(
      this.hitBox.pos,
      this.scene.player.hitBox.pos
    );
    this.rotation = lookAtPlayer.angle;

    return lookAtPlayer;
  }

  testCollideWithZombies() {
    const { hitBox } = this;

    // Test collision with all other zombies
    for (let i = 0; i < this.scene.zombies.length; i++) {
      // If this is the same zombie, skip
      if (this.scene.zombies[i] == this) continue;

      // Soft body collision a check
      const response = new SAT.Response();
      if (
        SAT.testCircleCircle(hitBox, this.scene.zombies[i].hitBox, response)
      ) {
        this.velocity = this.velocity.sub(response.overlapV.scale(0.2));
      }
    }
  }

  updateCharacter(delta) {
    if (!(this.health <= 0)) {
      this.velocity = this.lookAtPlayer().vectorTo.normalize();

      this.rigidBodyCollisionCheck(
        SAT.testCircleCircle,
        this.scene.player.hitBox,
        () => {
          this.scene.player.hit();
        }
      );
      this.testCollideWithZombies();
    }
  }
}

export default Zombie;
