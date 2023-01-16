import { Container, Sprite, Ticker } from 'pixijs';

class Bullet extends Container {
  constructor(muzzle, texture) {
    super();
    this.x = muzzle.x;
    this.y = muzzle.y + 100;

    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);
    console.log(this);

    this.ticker = Ticker.shared;
    this.ticker.add(this.update, this);
  }

  update(delta) {}
}

export default Bullet;
