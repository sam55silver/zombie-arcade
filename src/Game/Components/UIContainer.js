import { Container, AnimatedSprite, Sprite } from 'pixi.js';

class Unit extends Container {
  constructor(sprites, scale) {
    super();
    this.sprite = new AnimatedSprite(sprites);
    this.sprite.scale.set(scale.x, scale.y);
    this.addChild(this.sprite);
  }

  update(frame) {
    this.sprite.gotoAndStop(frame);
  }
}

class UIContainer extends Container {
  constructor(scene, icon, item, unitCount, position, callback, scale) {
    super();

    this.x = position.x;
    this.y = position.y;

    this.icon = new Sprite(scene.spriteSheet.textures[icon + '.png']);
    this.icon.scale.set(scene.spriteScale);

    this.addChild(this.icon);

    const sprites = scene.spriteSheet.animations[item];
    
    this.unitCount = unitCount

    this.units = [];
    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < unitCount; i++) {
      const unit = new Unit(sprites, scale);
      unit.x = offsetX;
      unit.y = offsetY;
      
      offsetX += unit.width + 1.5 * scene.spriteScale;

      if (unitCount > 19 && i == unitCount / 2 - 1) {
        offsetY = unit.height + 1.5 * scene.spriteScale
        offsetX = 0
      }

      this.addChild(unit);
      this.units.push(unit);
    }

    this.callback = callback;
  }

  setUnits() {

  }

  update() {
    this.callback(this);
  }
}

export default UIContainer;
