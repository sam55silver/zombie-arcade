import { Container, Graphics, Sprite } from 'pixi.js';
import SAT from 'sat';

class JoyStick {
  constructor(scene, pos, callback) {
    this.joyStickPos = new SAT.Vector(pos.x, pos.y);
    this.joystickRadius = 35 * scene.spriteScale;
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

      callback(joyToCenter.clone());
    });

    scene.mobileUI.addChild(joyStickBG);
    scene.mobileUI.addChild(joyStickOutline);
    scene.mobileUI.addChild(this.joyStick);
  }
}

class MobileInput {
  constructor(scene) {
    this.mousePos = new SAT.Vector(0, 0);
    this.moveDir = new SAT.Vector(0, 0);
    this.reticlePos = new SAT.Vector(0, 0);

    this.reticle = new Sprite(scene.spriteSheet.animations['reticle'][0]);
    this.reticle.anchor.set(0.5);
    this.reticle.scale.set(scene.spriteScale);
    this.reticle.x = scene.player.x;
    this.reticle.y = scene.player.y;
    scene.mobileUI.addChild(this.reticle);

    const changeMove = (dir) => {
      this.moveDir = dir;

      // this.mousePos = this.reticlePos;
    };

    const changeMouse = (dir) => {
      if (dir.len() === 0) return;
      const playerPos = new SAT.Vector(scene.player.x, scene.player.y);

      this.reticlePos = playerPos.clone().add(dir.normalize().scale(80));

      this.reticle.x = this.reticlePos.x;
      this.reticle.y = this.reticlePos.y;

      this.mousePos = this.reticlePos;
    };

    changeMouse(new SAT.Vector(1, 1));

    new JoyStick(
      scene,
      {
        x: scene.map.area.bottomLeft.x, //+ 30 * scene.spriteScale,
        y: scene.map.area.bottomLeft.y, //+ 45 * scene.spriteScale,
      },
      changeMove
    );

    new JoyStick(
      scene,
      {
        x: scene.map.area.bottomRight.x - 30 * scene.spriteScale,
        y: scene.map.area.bottomRight.y + 45 * scene.spriteScale,
      },
      changeMouse
    );
  }
}

export default MobileInput;
