import { Container, Graphics, Sprite } from 'pixi.js';
import SAT from 'sat';

class JoyStick {
  constructor(scene, pos, callback) {
    this.joyStickPos = new SAT.Vector(pos.x, pos.y);
    this.joystickRadius = 50 * scene.spriteScale;
    this.joyStickGrabRadius = 20 * scene.spriteScale;

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

    const moveZone = new Graphics();
    moveZone.beginFill(0x9cc7d9);
    moveZone.alpha = 0;
    moveZone.drawCircle(0, 0, this.joystickRadius * 1.5);

    this.joyStick = new Container();
    this.joyStick.x = this.joyStickPos.x;
    this.joyStick.y = this.joyStickPos.y;
    this.joyStick.addChild(moveZone);
    this.joyStick.addChild(joyStickGraphic);

    this.joyStick.interactive = true;
    this.joyStick.moving = false;

    const bringToCenter = () => {
      this.joyStick.moving = false;
      this.joyStick.x = this.joyStickPos.x;
      this.joyStick.y = this.joyStickPos.y;
      callback(new SAT.Vector(0, 0));
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

      const pos = new SAT.Vector(e.client.x, e.client.y);
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

      callback(joyToCenter.clone());
    });

    scene.mobileUI.addChild(joyStickBG);
    scene.mobileUI.addChild(joyStickOutline);
    scene.mobileUI.addChild(this.joyStick);
  }
}

class MobileInput {
  constructor(scene) {
    this.mousePos = new SAT.Vector(50, 50);
    this.moveDir = new SAT.Vector(0, 0);
    this.reticlePos = new SAT.Vector(0, 0);
    this.isFiring = false;

    const changeMove = (dir) => {
      this.moveDir = dir.clone();
    };

    const moveReticle = (e) => {
      this.isFiring = true;
      const clickPos = new SAT.Vector(e.client.x, e.client.y);
      this.mousePos = clickPos.sub(scene.game.position);
    };

    scene.game.interactive = true;
    scene.game.on('pointerdown', (e) => {
      moveReticle(e);
    });
    scene.game.on('pointerup', (e) => {
      this.isFiring = false;
    });
    scene.game.on('pointerupoutside', (e) => {
      this.isFiring = false;
    });
    scene.game.on('pointermove', (e) => {
      moveReticle(e);
    });

    const mobileUIY = scene.mobileUI.screenHeight * (5 / 6);

    new JoyStick(
      scene,
      {
        x: scene.mobileUI.screenWidth * (1 / 4),
        y: mobileUIY,
      },
      changeMove
    );
  }
}

export default MobileInput;
