import { Container, AnimatedSprite, Sprite } from 'pixi.js';

class Unit extends Container {
  constructor(sprites, scale) {
    super();
    this.sprite = new AnimatedSprite(sprites);
    this.sprite.scale.set(scale);
    this.addChild(this.sprite);
  }

  update(frame) {
    this.sprite.gotoAndStop(frame);
  }
}

class UIContainer extends Container {
  constructor(scene, assetName, unitCount, xAxis) {
    super();

    this.x = xAxis;
    this.y = 6 * scene.spriteScale;

    this.icon = new Sprite(scene.spriteSheet.textures[assetName + '.png']);
    this.icon.scale.set(scene.spriteScale);
    this.addChild(this.icon);

    const sprites = scene.spriteSheet.animations[assetName];

    this.units = [];
    let offset = 0;
    for (let i = 0; i < unitCount; i++) {
      const unit = new Unit(sprites, scene.spriteScale);
      unit.x = offset;
      offset += unit.width + 1.5 * scene.spriteScale;
      this.addChild(unit);
      this.units.push(unit);
    }
  }
}

export default UIContainer;
