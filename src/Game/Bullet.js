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

    this.mapArea = scene.map.area;
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

    // Check if bullet is out of bounds
    // TODO: add offset of game area
    if (this.x < this.mapArea.topLeft.x || this.x > this.mapArea.topRight.x) {
      if (
        this.y < this.mapArea.topLeft.y ||
        this.y > this.mapArea.bottomRight.y
      ) {
        this.dead = true;
      }
    }
  }
}

export default Bullet;
