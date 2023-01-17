import { Container, Sprite, Ticker } from 'pixi.js';

class Bullet extends Container {
  constructor(muzzleloc, texture) {
    super();
    this.y = muzzleloc.y;
    this.x = muzzleloc.x;

    console.log(muzzleloc);

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
