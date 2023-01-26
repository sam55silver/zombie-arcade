import CharacterController from './CharacterController';
import { lookAt } from './Utility';
import SAT from 'sat';

class Zombie extends CharacterController {
  constructor(app, type, position) {
    super(
      app,
      { x: 200, y: 200 },
      15,
      [app.spriteSheet.textures[`ZombieDesign${type}.png`]],
      { x: 0.5, y: 0.9 },
      1,
      Zombie.update
    );

    this.app = app;

    this.lookAtPlayer();

    this.health = 2;
  }

  hit() {
    this.health -= 1;
    if (this.health <= 0) {
      this.ticker.remove(this.update, this);
      this.app.zombies = this.app.zombies.filter((zombie) => zombie !== this);
      this.destroy();
    }
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
      if (this.app.zombies == this) continue;

      // Soft body collision check
      const response = new SAT.Response();
      if (SAT.testCircleCircle(hitBox, this.app.zombies[i].hitBox, response)) {
        this.velocity = response.a.pos.sub(response.overlapV);
      }
    }
  }

  update(delta) {
    const { hitBox } = this;

    const moveDir = this.lookAtPlayer().vectorTo.normalize();

    const response = new SAT.Response();
    if (!SAT.testCircleCircle(hitBox, this.app.player.hitBox, response)) {
      this.velocity = moveDir.scale(this.speed);
    } else {
      // TODO: add player hit here

      if (response.overlap < 1) {
        this.velocity = new SAT.Vector(0, 0);
      } else {
        this.velocity = this.velocity.sub(response.overlapV).scale(0.5);
      }
    }

    // this.testCollideWithZombies();
  }
}

export default Zombie;
