import SAT from 'sat';
import { Sprite, Graphics, Container } from 'pixi.js';

class Input {
  constructor(scene) {
    this.scene = scene;

    this.mousePos = new SAT.Vector(0, 0);
    this.moveDir = new SAT.Vector(0, 0);

    this.isFiring = false;

    this.reticle = new Sprite(scene.spriteSheet.animations['reticle'][0]);
    this.reticle.anchor.set(0.5);
    this.reticle.scale.set(scene.spriteScale);
    scene.addChild(this.reticle);

    this.updateReticle({ x: scene.game.x, y: scene.game.y });

    if (scene.isMobile) this.setupMobileControls();
    else this.setupDesktopControls();
  }

  updateReticle = (pos) => {
    this.reticle.x = pos.x;
    this.reticle.y = pos.y;

    this.mousePos.x = pos.x;
    this.mousePos.y = pos.y;
  };

  setupDesktopControls() {
    this.pressed = [];

    const checkKey = (key, isPressed) => {
      if (isPressed) this.pressed.push(key);
      else this.pressed = this.pressed.filter((k) => k !== key);
    };

    document.addEventListener('mousemove', (e) => {
      this.updateReticle({ x: e.clientX, y: e.clientY });
    });
    document.addEventListener('mousedown', (e) => {
      this.isFiring = true;
    });
    document.addEventListener('mouseup', (e) => {
      this.isFiring = false;
    });

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      checkKey(e.key, true);
    });

    document.addEventListener('keyup', (e) => {
      checkKey(e.key, false);
    });
  }

  update() {
    if (this.pressed) {
      this.moveDir.x = 0;
      this.moveDir.y = 0;
      for (let i in this.pressed) {
        const key = this.pressed[i];
        switch (key) {
          case 'w':
            this.moveDir.y = -1;
            break;
          case 'a':
            this.moveDir.x = -1;
            break;
          case 's':
            this.moveDir.y = 1;
            break;
          case 'd':
            this.moveDir.x = 1;
            break;
        }
      }
    }
  }

  setupMobileControls() {
    this.scene.game.interactive = true;

    this.scene.game.on('pointerdown', (e) => {
      this.updateReticle({ x: e.clientX, y: e.clientY });
      this.isFiring = true;
    });
    this.scene.game.on('pointermove', (e) => {
      this.updateReticle({ x: e.clientX, y: e.clientY });
      this.isFiring = true;
    });
    this.scene.game.on('pointerup', (e) => {
      this.isFiring = false;
    });
    this.scene.game.on('pointerupoutside', (e) => {
      this.isFiring = false;
    });

    this.joyStickPos = new SAT.Vector(
      this.scene.mobileUI.screenWidth * (1 / 4),
      this.scene.mobileUI.screenHeight * (5 / 6)
    );
    this.joystickRadius = 50 * this.scene.spriteScale;
    this.joyStickGrabRadius = 20 * this.scene.spriteScale;

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
      this.moveDir = new SAT.Vector(0, 0);
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

      this.moveDir = joyToCenter.clone();
    });

    this.scene.mobileUI.addChild(joyStickBG);
    this.scene.mobileUI.addChild(joyStickOutline);
    this.scene.mobileUI.addChild(this.joyStick);
  }

  subMoveDir(v) {
    this.moveDir = this.moveDir.sub(v);
  }
}

export default Input;
