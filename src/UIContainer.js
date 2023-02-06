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
  constructor(scene, assetName, unitCount, position) {
    super();

    this.x = position.x;
    this.y = position.y;

    this.icon = new Sprite(scene.spriteSheet.textures[assetName + '.png']);
    this.icon.scale.set(2);
    this.addChild(this.icon);

    const sprites = scene.spriteSheet.animations[assetName];

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
}

export default UIContainer;
