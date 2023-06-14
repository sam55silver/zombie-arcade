import CharacterController from './CharacterController';
import SAT from 'sat';
import { Coin } from './Collectibles';

class Zombie extends CharacterController {
  constructor(scene, type, position) {
    super(
      scene,
      position,
      6,
      [scene.spriteSheet.textures[`zombie-${type}.png`]],
      { x: 0.5, y: 0.9 },
      1,
      2
    );

    this.setHitBoxOffset({ x: 4, y: 4 });

    this.health = 2;
    this.lookAtPlayer();
    this.alreadyHit = false;
  }

  hit() {
    this.health--;
    if (this.health <= 0 && !this.alreadyHit) {
      this.alreadyHit = true;

      const spawnPosition = {
        x: this.hitBox.pos.x - this.scene.game.x,
        y: this.hitBox.pos.y - this.scene.game.y,
      };
      new Coin(this.scene, spawnPosition);

      this.scene.zombies = this.scene.zombies.filter(
        (zombie) => zombie !== this
      );

      this.scene.gameArea.removeChild(this);
      this.scene.deadZombies.addChild(this);

      const offset = {
        x: 16 * this.scene.spriteScale,
        y: 21 * this.scene.spriteScale,
      };

      this.playDeathAnimation('zombie-death', offset);
      this.sprite.onComplete = () => {
        this.scene.deadZombies.removeChild(this);
      };
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
