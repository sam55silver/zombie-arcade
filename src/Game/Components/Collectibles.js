import { Container, Graphics, Sprite } from 'pixi.js';
import SAT from 'sat';
import { Howl } from 'howler'

class Collectible extends Container {
  constructor(scene, pos, sprite, angle) {
    super();

    this.scene = scene;
    this.playerHitBox = scene.player.hitBox;
    this.x = pos.x;
    this.y = pos.y;
    this.timeout = 10000;
    this.fade = this.timeout;
    this.scaleUp = true;
    this.animSpeed = 0;
    this.aliveTime = 0;

    this.radius = 10 * scene.spriteScale;

    this.hitBox = new SAT.Circle(
      new SAT.Vector(this.x + scene.game.x, this.y + scene.game.y),
      this.radius
    );

    this.sprite = new Sprite(sprite);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set((scene.spriteScale * 2) / 3);
    // this.sprite.scale.y and x will be the same
    this.spriteNormScale = this.sprite.scale.x;
    
    this.pickupSound = new Howl({src: ['https://assets.samsilver.ca/zombie-arcade/sounds/pickup.wav'], volume: 0.1})

    if (angle) {
      this.sprite.angle = angle;
    }

    this.addChild(this.sprite);

    if (this.scene.debug) {
      this.debug = new Graphics();
      this.debug.beginFill(0xff0000);
      this.debug.drawCircle(0, 0, this.radius);
      this.debug.endFill();

      this.addChild(this.debug);
    }

    scene.collectibles.addChild(this);

    scene.startTimeout(() => {
      this.scene.collectibles.removeChild(this);
    }, this.timeout);
  }

  update(delta, elapsedMS) {
    this.aliveTime += elapsedMS;
    
    // Check if player is touching collectible
    if (SAT.testCircleCircle(this.hitBox, this.playerHitBox)) {
      if (this.pickup) {
        this.pickup();
      }
      this.pickupSound.play()
      this.scene.collectibles.removeChild(this);
    }

    // check if game is over
    if (this.scene.gameOver) {
      this.scene.collectibles.removeChild(this);
    }

    const animLength = 450;
    const scaleVariation = 0.4
    const scaleBy = Math.sin(this.aliveTime / animLength) * scaleVariation + 1.2;

    this.sprite.scale.set(scaleBy * this.spriteNormScale);

    // spin
    const spinLength = 200
    const spinVariation = 0.2
    const rotateBy = Math.sin(this.aliveTime / spinLength) * spinVariation

    this.rotation = rotateBy
    
    // Check timeout and remove if expired
    this.fade -= elapsedMS;
    if (this.fade <= this.timeout / 3) {
      // Fade out
      this.animSpeed += elapsedMS;

      if (this.animSpeed > 200) {
        if (this.sprite.alpha == 0) {
          this.sprite.alpha = 1;
        } else {
          this.sprite.alpha = 0;
        }

        this.animSpeed = 0;
      }
    }
  }
}

export class Coin extends Collectible {
  constructor(scene, pos) {
    super(scene, pos, scene.spriteSheet.textures['kill-ui.png']);
  }

  pickup() {
    this.scene.killCount.update();
  }
}

class Health extends Collectible {
  constructor(scene, pos) {
    super(scene, pos, scene.spriteSheet.textures['health-pickup.png']);
  }

  pickup() {
    this.scene.player.timesHit--;
    if (this.scene.player.timesHit < 0) {
      this.scene.player.timesHit = 0;
    }
    this.scene.playerHealth.update();
  }
}

class MachineGun extends Collectible {
  constructor(scene, pos) {
    super(scene, pos, scene.spriteSheet.textures['ak.png'], 45);
  }

  pickup() {
    this.scene.player.setFireState('machineGun');
  }
}

class Shotgun extends Collectible {
  constructor(scene, pos) {
    super(scene, pos, scene.spriteSheet.textures['shotgun.png'], 45);
  }

  pickup() {
    this.scene.player.setFireState('shotgun');
  }
}

export class CollectibleSpawner {
  constructor(scene) {
    this.scene = scene;
    this.spawnRate = 15000;

    this.spawnTimer();
  }

  spawnTimer() {
    this.scene.startTimeout(() => {
      if (!this.scene.gameOver) {
        this.spawn();
        this.spawnTimer();
      }
    }, this.spawnRate);
  }

  spawn() {
    // Choose random position
    // choose point between this.scene.map.area.topLeft and this.scene.map.area.bottomRight
    const gap = 20;

    const spawnPosition = {
      x:
        this.scene.map.area.topLeft.x +
        gap +
        Math.random() *
          (this.scene.map.area.bottomRight.x -
            gap -
            (this.scene.map.area.topLeft.x + gap)),
      y:
        this.scene.map.area.topLeft.y +
        gap +
        Math.random() *
          (this.scene.map.area.bottomRight.y -
            gap -
            (this.scene.map.area.topLeft.y + gap)),
    };

    // choose random between 0 and 2
    let rand = Math.floor(Math.random() * 3);

    if (rand == 0) {
      new Health(this.scene, spawnPosition);
    } else if (rand == 1) {
      new MachineGun(this.scene, spawnPosition);
    } else if (rand == 2) {
      new Shotgun(this.scene, spawnPosition);
    }
  }
}
