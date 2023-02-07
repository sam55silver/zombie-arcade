import { Container, Graphics } from 'pixi.js';
import SAT from 'sat';

class JoyStick {
  constructor(scene, pos, input, type) {
    this.joyStickPos = new SAT.Vector(pos.x, pos.y);
    this.joystickRadius = 28 * scene.spriteScale;
    this.joyStickGrabRadius = 14 * scene.spriteScale;

    const joyStickBG = new Graphics();
    joyStickBG.beginFill(0x9cc7d9);
    joyStickBG.alpha = 0.3;
    joyStickBG.drawCircle(
      this.joyStickPos.x,
      this.joyStickPos.y,
      this.joystickRadius
    );
    joyStickBG.endFill();

    const joyStickOutline = new Graphics();
    joyStickOutline.alpha = 1;
    joyStickOutline.lineStyle(2, 0x9cc7d9);
    joyStickOutline.drawCircle(
      this.joyStickPos.x,
      this.joyStickPos.y,
      this.joystickRadius
    );

    const joyStickGraphic = new Graphics();
    joyStickGraphic.beginFill(0x9cc7d9);
    joyStickGraphic.alpha = 1;
    joyStickGraphic.drawCircle(0, 0, this.joyStickGrabRadius);
    joyStickGraphic.endFill();

    this.joyStick = new Container();
    this.joyStick.x = this.joyStickPos.x;
    this.joyStick.y = this.joyStickPos.y;
    this.joyStick.addChild(joyStickGraphic);

    this.joyStick.interactive = true;
    this.joyStick.moving = false;

    const bringToCenter = () => {
      this.joyStick.moving = false;
      this.joyStick.x = this.joyStickPos.x;
      this.joyStick.y = this.joyStickPos.y;
      input[type] = new SAT.Vector(0, 0);
    };

    this.joyStick.on('pointerdown', (e) => {
      this.joyStick.moving = true;
    });
    this.joyStick.on('pointerup', (e) => {
      bringToCenter();
    });
    this.joyStick.on('pointerupoutside', (e) => {
      bringToCenter();
    });

    this.joyStick.on('pointermove', (e) => {
      if (!this.joyStick.moving) return;

      const pos = new SAT.Vector(e.screen.x, e.screen.y);
      const joyToCenter = pos.clone().sub(this.joyStickPos);
      const dist = joyToCenter.clone().len();
      if (dist > this.joystickRadius - this.joyStickGrabRadius / 2) {
        pos
          .sub(this.joyStickPos)
          .normalize()
          .scale(this.joystickRadius - this.joyStickGrabRadius / 2);
        pos.add(this.joyStickPos);
      }

      this.joyStick.x = pos.x;
      this.joyStick.y = pos.y;

      input[type] = joyToCenter.clone();
    });

    scene.addChild(joyStickBG);
    scene.addChild(joyStickOutline);
    scene.addChild(this.joyStick);
  }
}

class MobileInput {
  constructor(scene) {
    this.mousePos = new SAT.Vector(0, 0);
    this.moveDir = new SAT.Vector(0, 0);

    new JoyStick(
      scene,
      {
        x: scene.map.area.bottomLeft.x + 20 * scene.spriteScale,
        y: scene.map.area.bottomLeft.y + 40 * scene.spriteScale,
      },
      this,
      'moveDir'
    );

    new JoyStick(
      scene,
      {
        x: scene.map.area.bottomRight.x - 20 * scene.spriteScale,
        y: scene.map.area.bottomRight.y + 40 * scene.spriteScale,
      },
      this,
      'mousePos'
    );
  }
}

export default MobileInput;
