import { Container, AnimatedSprite, Sprite } from 'pixi.js';

class Unit extends Container {
  constructor(sprites) {
    super();
    this.sprite = new AnimatedSprite(sprites);
    this.sprite.scale.set(2);
    this.addChild(this.sprite);
  }

  update(frame) {
    this.sprite.gotoAndStop(frame);
  }
}

class UIContainer extends Container {
  constructor(app, assetName, unitCount, position, countCallback) {
    super();
    this.count = 0;

    this.x = position.x;
    this.y = position.y;

    this.countCallback = countCallback;

    this.icon = new Sprite(app.spriteSheet.textures[assetName + '.png']);
    this.icon.scale.set(2);
    this.addChild(this.icon);

    const sprites = app.spriteSheet.animations[assetName];

    this.units = [];
    let offset = 0;
    for (let i = 0; i < unitCount; i++) {
      const unit = new Unit(sprites);
      unit.x = offset;
      offset += unit.width + 2;
      this.addChild(unit);
      this.units.push(unit);
    }
  }

  update() {
    this.count++;
    this.countCallback(this);
  }
}

export default UIContainer;
