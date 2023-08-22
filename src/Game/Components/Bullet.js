import CharacterController from './CharacterController';
import SAT from 'sat';

class Bullet extends CharacterController {
  constructor(scene, x, y, rotation) {
    super(
      scene,
      { x, y },
      2,
      [scene.spriteSheet.textures['bullet-0.png']],
      { x: 0.5, y: 0.5 },
      8
    );

    this.sprite.scale.set(scene.spriteScale * (2 / 3));
    this.rotation = rotation - Math.PI / 2;
    this.sprite.rotation = Math.PI / 2;

    const muzzleOffset = 21 * scene.spriteScale;
    this.x += Math.cos(this.rotation) * muzzleOffset;
    this.y += Math.sin(this.rotation) * muzzleOffset;

    this.mapArea = scene.map.area;
    this.zombies = scene.zombies;
    this.zombiesHit = [];

    setTimeout(() => {
      this.destroy({ children: true });
    }, 1000);
  }

  updateCharacter() {
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
    if (
      this.x < this.mapArea.topLeft.x ||
      this.x > this.mapArea.topRight.x ||
      this.y < this.mapArea.topLeft.y ||
      this.y > this.mapArea.bottomRight.y
    ) {
      this.dead = true;
    }
  }
}

export default Bullet;
