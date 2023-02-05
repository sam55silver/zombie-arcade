import { Container, AnimatedSprite, Sprite } from 'pixi.js';

class KillNumber extends Container {
  constructor(app) {
    super();
    this.sprite = new AnimatedSprite(app.spriteSheet.animations['kill-count']);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(2);
    this.addChild(this.sprite);
  }
}

class KillCountUI extends Container {
  constructor(app) {
    super();
    this.app = app;
    this.killCount = 0;

    const icon = new Sprite(app.spriteSheet.textures['kill-ui-icon.png']);
    icon.anchor.set(0.5);
    icon.scale.set(2);
    this.addChild(icon);

    const addNumber = (offset) => {
      const num = new KillNumber(app);
      num.x = offset;
      this.addChild(num);
      return num;
    };

    this.num1 = addNumber(32);
    this.num2 = addNumber(this.num1.x + 18);
    this.num3 = addNumber(this.num2.x + 18);
  }

  update() {
    this.killCount++;
    console.log(this.killCount);
  }
}

export default KillCountUI;
