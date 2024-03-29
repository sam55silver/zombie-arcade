import CharacterController from './CharacterController';
import Bullet from './Bullet';
import SAT from 'sat';
import GameOverScore from '../../Menus/gameOver';
import { Howl } from 'howler'

class Player extends CharacterController {
  constructor(scene) {
    super(
      scene,
      { x: 0, y: 0 },
      6,
      scene.spriteSheet.animations['player-gunshot-anim'],
      { x: 0.5, y: 0.9 },
      2
    );

    this.regularSpeed = 2;
    this.slowSpeed = this.regularSpeed / 3;
    this.speed = this.regularSpeed;

    this.fireState = 'start';
    this.firing = false;

    scene.startTimeout(() => {
      this.fireState = 'normal'
    }, 100)

    this.bullets = 0
    this.maxBullets = 0

    this.maxHealth = 8;
    this.timesHit = 0;

    this.gunVolume = 0.08
    this.shotgunVolume = 0.16
    this.gunNoise = new Howl({src: ['https://assets.samsilver.ca/zombie-arcade/sounds/fire.mp3'], volume: this.gunVolume})    

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
      this.scene.app.musicFadeOut()
      this.scene.app.gameoverMusic.play()

      this.scene.gameOver = true;
      this.scene.zombies.forEach((zombie) => {
        const offset = {
          x: 23 * this.scene.spriteScale,
          y: 29 * this.scene.spriteScale,
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

  setFireState(state) {
    this.fireState = state;

    this.scene.game.removeChild(this.scene.shotgunUI)
    this.scene.game.removeChild(this.scene.akUI)

    this.bullets = 0
    this.maxBullets = 0

    if (state == 'machineGun') {
      const bullets = this.scene.akUI.unitCount
      this.bullets = bullets
      this.maxBullets = bullets

      this.scene.akUI.update()
      this.scene.game.addChild(this.scene.akUI)
    } else if (state == 'shotgun') {
      const bullets = this.scene.shotgunUI.unitCount
      this.bullets = bullets
      this.maxBullets = bullets
      
      this.scene.shotgunUI.update()
      this.scene.game.addChild(this.scene.shotgunUI)
    }
  }

  fire() {
    switch (this.fireState) {
      case 'normal':
        this.fireNormal();
        break;
      case 'shotgun':
        this.fireShotgun();
        break;
      case 'machineGun':
        this.fireMachineGun();
        break;
      case 'start':
        break;
    }
  }

  fireShotgun() {
    if (this.sprite.playing) return;

    this.sprite.textures =
      this.scene.spriteSheet.animations['player-gunshot-anim'];
    this.sprite.play();

    this.gunNoise.volume(this.shotgunVolume)
    this.gunNoise.play()

    // create 5 bullets to spawn
    let rotVariation = 0.2;
    const rotIncr = 0.2;
    for (let i = 0; i < 3; i++) {
      const rot = this.rotation + rotVariation;
      rotVariation -= rotIncr;

      new Bullet(this.scene, this.x, this.y, rot);
    }
    this.bullets -= 1
    this.scene.shotgunUI.update()

    if (this.bullets <= 0) {
      this.setFireState('normal', 0)
    }
  }

  fireMachineGun() {
    if (this.firing) return;
    this.firing = true;
    this.sprite.textures =
      this.scene.spriteSheet.animations['player-gunshot-anim'];
    this.sprite.gotoAndStop(0);
    this.gunNoise.volume(this.gunVolume)
    this.gunNoise.play()

    this.scene.startTimeout(() => {
      this.firing = false;
      this.sprite.play();
    }, 50);

    // Add variation to rotation
    const rotationVariation = 0.15;
    const rand = (Math.random() - 0.5) * rotationVariation;

    const newRot = this.rotation + rand;

    new Bullet(this.scene, this.x, this.y, newRot);
    this.bullets -= 1
    this.scene.akUI.update()

    if (this.bullets <= 0) {
      this.setFireState('normal', 0)
    }
  }

  fireNormal() {
    if (this.sprite.playing) return;

    this.sprite.textures =
      this.scene.spriteSheet.animations['player-gunshot-anim'];
    this.gunNoise.volume(this.gunVolume)
    this.sprite.play();

    this.gunNoise.play()

    new Bullet(this.scene, this.x, this.y, this.rotation);
  }

  updateCharacter() {
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

          this.scene.input.removeInput();

          const gameOver = GameOverScore(
            this.scene.app,
            this.scene.killCount.count
          );
          this.scene.changeScene(gameOver);
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
