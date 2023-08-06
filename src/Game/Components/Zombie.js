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
      0.6
    );

    this.setHitBoxOffset({ x: 4, y: 4 });

    this.sprite.rotation = Math.PI / 2

    this.health = 2;
    this.alreadyHit = false;

    this.rotation = this.lookAt(
      this.hitBox.pos,
      this.scene.player.hitBox.pos
    ).angle - Math.PI / 2;
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
    const currentAngle = this.rotation
    
    const target = Math.atan2(this.scene.player.hitBox.pos.y - this.hitBox.pos.y,this.scene.player.hitBox.pos.x - this.hitBox.pos.x)

    let angleDifference = target - currentAngle;

    const diff = 2 * Math.PI 
    while (angleDifference > 2 * Math.PI / 2) {
      angleDifference -= diff;
    }
    while (angleDifference < -Math.PI / 2) {
      angleDifference += diff
    }

    const lerpFactor = 0.035
    const newAngle = currentAngle + lerpFactor * angleDifference

    this.rotation = newAngle
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
      this.lookAtPlayer()

      const x = Math.cos(this.rotation)
      const y = Math.sin(this.rotation)
      console.log(x, y, this.hitBox.pos)

      this.velocity = new SAT.Vector(x,y)


      // this.velocity = this.lookAtPlayer().vectorTo.normalize();
      //
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
