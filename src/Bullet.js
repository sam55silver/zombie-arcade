import { Container, Sprite, Ticker } from 'pixi.js';
import { updateContainer } from './Utility';
import SAT from 'sat';

class Bullet extends Container {
  constructor(app, x, y, rotation) {
    super();
    const muzzleOffset = 35;
    this.rotation = rotation - Math.PI / 2;
    const offset = {
      x: Math.cos(this.rotation) * muzzleOffset,
      y: Math.sin(this.rotation) * muzzleOffset,
    };

    this.zombies = app.zombies;
    console.log(app.zombies[0].hitBox.pos);

    this.x = x + offset.x;
    this.y = y + offset.y;
    this.hitBox = new SAT.Circle(new SAT.Vector(this.x, this.y), 5);

    this.speed = 10;

    this.sprite = new Sprite(app.spriteSheet.textures['Bullet.png']);
    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);

    app.gameArea.addChild(this);

    this.ticker = Ticker.shared;
    this.ticker.add(this.update, this);

    this.zombiesHit = [];

    setTimeout(() => {
      this.ticker.remove(this.update, this);
      this.destroy();
    }, 1000);
  }

  update(delta) {
    this.hitBox.pos.x += Math.cos(this.rotation) * this.speed * delta;
    this.hitBox.pos.y += Math.sin(this.rotation) * this.speed * delta;

    // Update hitbox
    updateContainer(this, this.hitBox.pos);

    // Check for collision with zombies
    this.zombies.forEach((zombie) => {
      if (
        !this.zombiesHit.includes(zombie) &&
        SAT.testCircleCircle(this.hitBox, zombie.hitBox)
      ) {
        this.zombiesHit.push(zombie);
        zombie.hit();
      }
    });
  }
}

export default Bullet;
