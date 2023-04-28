import { Container, Graphics, Sprite } from 'pixi.js';
import SAT from 'sat';

class Collectible extends Container {
  constructor(scene, pos, sprite) {
    super();

    this.scene = scene;
    this.playerHitBox = scene.player.hitBox;
    this.x = pos.x;
    this.y = pos.y;

    this.radius = 5 * scene.spriteScale;

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
    }, 1000);
  }

  update(delta) {
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
  }
}

export default Collectible;
