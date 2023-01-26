import { Container, Ticker, AnimatedSprite, Graphics } from 'pixi.js';
import SAT from 'sat';

class CharacterController extends Container {
  constructor(app, pos, hitBoxRadius, sprite, origin, speed, update) {
    super();

    this.x = pos.x;
    this.y = pos.y;
    this.hitBox = new SAT.Circle(new SAT.Vector(this.x, this.y), hitBoxRadius);

    this.sprite = new AnimatedSprite(sprite);
    this.sprite.loop = false;
    this.sprite.gotoAndStop(sprite.length - 1);
    this.sprite.anchor.set(origin.x, origin.y);
    this.sprite.animationSpeed = 0.2;
    this.addChild(this.sprite);

    // Collision debug
    // const obj = new Graphics();
    // obj.beginFill(0xff0000);
    // obj.drawCircle(0, 0, hitBoxRadius);
    // this.addChild(obj);

    this.speed = speed;
    this.velocity = new SAT.Vector(0, 0);

    this.ticker = Ticker.shared;
    this.ticker.add(this.update, this);
    this.ticker.add(this.updateCharacter, this);

    app.gameArea.addChild(this);
  }

  addToUpdate(update, player) {
    this.ticker.add(update, player);
  }

  updateCharacter(delta) {
    this.x += this.velocity.x * delta;
    this.y += this.velocity.y * delta;
    this.hitBox.pos.x = this.x;
    this.hitBox.pos.y = this.y;
  }
}

export default CharacterController;
