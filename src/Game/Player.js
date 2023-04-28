import CharacterController from './CharacterController';
import Bullet from './Bullet';
import SAT from 'sat';
import Game from './Game';

class Player extends CharacterController {
  constructor(scene) {
    super(
      scene,
      { x: 0, y: 0 },
      6,
      scene.spriteSheet.animations['player-gunshot-anim'],
      { x: 0.5, y: 0.9 },
      3.5
    );

    this.regularSpeed = 3.5;
    this.slowSpeed = this.regularSpeed / 3;
    this.speed = this.regularSpeed;

    this.maxHealth = 8;
    this.timesHit = 0;

    this.isInvulnerable = false;

    this.deathOffsets = {
      1: { x: 33, y: 53 },
      2: { x: 16, y: 20 },
      5: { x: 32, y: 36 },
      'regular': { x: 16, y: 28 },
    };

    Object.keys(this.deathOffsets).forEach((offset) => {
      this.deathOffsets[offset].x *= scene.spriteScale;
      this.deathOffsets[offset].y *= scene.spriteScale;
    });
  }

  hit() {
    if (this.isInvulnerable || this.timesHit >= this.maxHealth) return;

    this.timesHit++;
    this.scene.playerHealth.update();

    if (this.timesHit >= this.maxHealth) {
      this.scene.gameOver = true;
      this.scene.zombies.forEach((zombie) => {
        const offset = {
          x: 16 * this.scene.spriteScale,
          y: 22 * this.scene.spriteScale,
        };
        zombie.playDeathAnimation('zombie-fade', offset);
        zombie.sprite.onComplete = () => {
          this.scene.zombieFadeDone = true;
        };
      });

      this.scene.zombies = [];
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
    console.log('player', this.hitBox.pos);
  }

  updateCharacter(delta) {
    if (this.scene.gameOver) {
      this.velocity = new SAT.Vector(0, 0);
      if (this.scene.zombieFadeDone) {
        const deathNum = Math.floor(Math.random() * 7) + 1;
        let offset = { x: 0, y: 0 };
        if (deathNum in this.deathOffsets) {
          offset = this.deathOffsets[deathNum];
        } else {
          offset = this.deathOffsets['regular'];
        }

        this.playDeathAnimation(`deaths/player-death-${deathNum}`, offset);

        this.sprite.onComplete = () => {
          if (this.scene.eventListener) {
            this.scene.eventListener.forEach((listener) => {
              document.removeEventListener(listener.event, listener.callback);
            });
          }
          const newGame = Game(this.scene.app);
          this.scene.changeScene(newGame);
        };
      }
      return;
    }

    const angle = this.lookAt(this.hitBox.pos, this.scene.input.mousePos).angle;
    this.rotation = angle;

    if (this.scene.input.isFiring) this.fire();

    // move
    this.velocity = this.scene.input.moveDir.clone().normalize();

    // Test collision with all other zombies
    let inZombie = false;
    for (let i = 0; i < this.scene.zombies.length; i++) {
      // Soft body collision a check
      const response = new SAT.Response();
      if (
        SAT.testCircleCircle(
          this.hitBox,
          this.scene.zombies[i].hitBox,
          response
        )
      ) {
        if (response.overlap > 2) {
          inZombie = true;
        }
      }
    }
    if (inZombie) {
      this.speed = this.slowSpeed;
    } else {
      this.speed = this.regularSpeed;
    }

    this.rigidBodyCollisionCheck(SAT.testCirclePolygon, this.scene.map.walls);
  }
}

export default Player;
