import { Container, AnimatedSprite } from 'pixi.js';

class Zombie extends Container {
  constructor(app, type, position) {
    super();

    this.app = app;

    this.x = position.x;
    this.y = position.y;

    // console.log(app.spriteSheet.textures);
    this.sprite = new AnimatedSprite([
      app.spriteSheet.textures[`ZombieDesign${type}.png`],
    ]);
    this.sprite.stop();
    this.addChild(this.sprite);
  }
}

export default Zombie;
