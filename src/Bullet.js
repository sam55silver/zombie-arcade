import { Container, Sprite, Ticker } from 'pixi.js';

class Bullet extends Container {
  constructor(app, x, y, rotation) {
    super();
    const muzzleOffset = 5;
    const offset = {
      x: Math.cos(rotation) * muzzleOffset,
      y: Math.sin(rotation) * muzzleOffset,
    };
    console.log(offset);
    this.x = x + offset.x;
    this.y = y + offset.y;
    this.rotation = rotation - Math.PI / 2;
    this.speed = 10;

    this.sprite = new Sprite(app.spriteSheet.textures['Bullet.png']);
    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);

    app.stage.addChild(this);

    this.ticker = Ticker.shared;
    this.ticker.add(this.update, this);

    setTimeout(() => {
      console.log('destroyed');
      console.log(app.stage.children);
      this.ticker.remove(this.update, this);
      this.destroy();
    }, 1000);
  }

  update(delta) {
    this.x += Math.cos(this.rotation) * this.speed * delta;
    this.y += Math.sin(this.rotation) * this.speed * delta;
  }
}

export default Bullet;
