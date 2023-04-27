import { Container, Graphics } from 'pixi.js';
import SAT from 'sat';

class Collectible extends Container {
  constructor(scene, pos) {
    super();

    this.scene = scene;
    this.playerHitBox = scene.player.hitBox;
    this.x = pos.x;
    this.y = pos.y;

    this.radius = 5 * scene.spriteScale;

    this.hitBox = new SAT.Circle(
      new SAT.Vector(this.scene.game.x + this.x, this.scene.game.y + this.y),
      this.radius
    );

    this.hitBoxGraphic = new Graphics();
    this.hitBoxGraphic.beginFill(0xff0000);
    this.hitBoxGraphic.drawCircle(0, 0, this.radius);
    this.hitBoxGraphic.endFill();

    this.addChild(this.hitBoxGraphic);

    scene.gameArea.addChild(this);
  }

  update(delta) {
    // Check if player is touching collectible
    if (SAT.testCircleCircle(this.hitBox, this.playerHitBox)) {
      if (this.pickup) {
        this.pickup();
      }
      this.scene.gameArea.removeChild(this);
    }
  }
}

export default Collectible;
