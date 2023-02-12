import { Container, Sprite } from 'pixi.js';
import CharacterController from './CharacterController';
import SAT from 'sat';

class Bullet extends CharacterController {
  constructor(scene, x, y, rotation) {
    super(
      scene,
      { x, y },
      2,
      [scene.spriteSheet.textures['bullet.png']],
      { x: 0.5, y: 0.5 },
      10
    );

    this.sprite.scale.set(scene.spriteScale * (2 / 3));
    this.rotation = rotation - Math.PI / 2;
    this.sprite.rotation = Math.PI / 2;

    const muzzleOffset = 35;
    this.x += Math.cos(this.rotation) * muzzleOffset;
    this.y += Math.sin(this.rotation) * muzzleOffset;

    this.walls = scene.map.walls;
    this.zombies = scene.zombies;
    this.zombiesHit = [];

    setTimeout(() => {
      this.destroy({ children: true });
    }, 1000);
  }

  updateCharacter(delta) {
    // Move bullet
    this.velocity.x = Math.cos(this.rotation);
    this.velocity.y = Math.sin(this.rotation);

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

    // Check for collision with walls
    this.walls.forEach((wall) => {
      if (SAT.testCirclePolygon(this.hitBox, wall)) {
        this.dead = true;
      }
    });
  }
}

export default Bullet;
