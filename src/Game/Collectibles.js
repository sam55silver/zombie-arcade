import { Container, Graphics, Sprite } from 'pixi.js';
import SAT from 'sat';

class Collectible extends Container {
  constructor(scene, pos, sprite) {
    super();

    this.scene = scene;
    this.playerHitBox = scene.player.hitBox;
    this.x = pos.x;
    this.y = pos.y;
    this.timeout = 10000;
    this.fade = this.timeout;
    this.animSpeed = 0;

    this.radius = 10 * scene.spriteScale;

    this.hitBox = new SAT.Circle(
      new SAT.Vector(this.x + scene.game.x, this.y + scene.game.y),
      this.radius
    );

    this.sprite = new Sprite(sprite);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set((scene.spriteScale * 2) / 3);
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
    // Check if player is touching collectible
    if (SAT.testCircleCircle(this.hitBox, this.playerHitBox)) {
      if (this.pickup) {
        this.pickup();
      }
      this.scene.collectibles.removeChild(this);
    }

    // check if game is over
    if (this.scene.gameOver) {
      this.scene.collectibles.removeChild(this);
    }

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
    super(scene, pos, scene.spriteSheet.textures['health-ui-0.png']);
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
    super(scene, pos, scene.spriteSheet.textures['health-ui-1.png']);
  }

  pickup() {
    this.scene.player.setFireState('machineGun', 6000);
  }
}

class Shotgun extends Collectible {
  constructor(scene, pos) {
    super(scene, pos, scene.spriteSheet.textures['bullet.png']);
  }

  pickup() {
    this.scene.player.setFireState('shotgun', 12000);
  }
}

export class CollectibleSpawner {
  constructor(scene) {
    this.scene = scene;
    this.spawnRate = 5000;

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
    const spawnPosition = {
      x:
        this.scene.map.area.topLeft.x +
        Math.random() *
          (this.scene.map.area.bottomRight.x - this.scene.map.area.topLeft.x),
      y:
        this.scene.map.area.topLeft.y +
        Math.random() *
          (this.scene.map.area.bottomRight.y - this.scene.map.area.topLeft.y),
    };

    // choose random number, 0 or 1
    let rand = Math.random();

    if (rand < 0.5) {
      new Health(this.scene, spawnPosition);
    } else if (rand >= 0.5) {
      new MachineGun(this.scene, spawnPosition);
    }
  }
}
