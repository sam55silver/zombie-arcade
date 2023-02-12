import { Container, Sprite } from 'pixi.js';
import SAT from 'sat';

class Bullet extends Container {
  constructor(scene, x, y, rotation) {
    super();
    const muzzleOffset = 35;
    this.rotation = rotation - Math.PI / 2;
    const offset = {
      x: Math.cos(this.rotation) * muzzleOffset,
      y: Math.sin(this.rotation) * muzzleOffset,
    };

    this.zombies = scene.zombies;

    this.x = x + offset.x;
    this.y = y + offset.y;
    this.hitBox = new SAT.Circle(new SAT.Vector(this.x, this.y), 5);

    this.speed = 10;

    this.sprite = new Sprite(scene.spriteSheet.textures['bullet.png']);
    this.sprite.rotation = Math.PI / 2;
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(scene.spriteScale * (2 / 3));

    this.addChild(this.sprite);

    scene.gameArea.addChild(this);

    this.zombiesHit = [];

    setTimeout(() => {
      this.destroy({ children: true });
    }, 1000);
  }

  update(delta) {
    this.hitBox.pos.x += Math.cos(this.rotation) * this.speed * delta;
    this.hitBox.pos.y += Math.sin(this.rotation) * this.speed * delta;

    // Update hit box
    this.x = this.hitBox.pos.x;
    this.y = this.hitBox.pos.y;

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
