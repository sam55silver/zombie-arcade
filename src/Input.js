import SAT from 'sat';
import { Sprite, Graphics, Container } from 'pixi.js';

class Input {
  constructor(scene) {
    this.scene = scene;

    this.pressed = [];

    this.mousePos = new SAT.Vector(0, 0);
    this.moveDir = new SAT.Vector(0, 0);

    this.reticle = new Sprite(scene.spriteSheet.animations['reticle'][0]);
    this.reticle.anchor.set(0.5);
    this.reticle.scale.set(scene.spriteScale);
    scene.addChild(this.reticle);

    if (scene.isMobile) this.setupMobileControls();
    else this.setupDesktopControls();
  }

  inputPress = (keyPressed, action) => {
    if (keyPressed) this.pressed.push(action);
  };

  inputRelease = (keyReleased, action) => {
    if (keyReleased) {
      this.pressed = this.pressed.filter((input) => input !== action);
    }
  };

  setupDesktopControls() {
    document.addEventListener('mousemove', (e) => {
      this.reticle.x = e.clientX;
      this.reticle.y = e.clientY;

      this.mousePos.x = e.clientX - this.scene.game.position.x;
      this.mousePos.y = e.clientY - this.scene.game.position.y;
    });
    document.addEventListener('mousedown', (e) => {
      this.inputPress(e.button == 0, 'fire');
    });
    document.addEventListener('mouseup', (e) => {
      this.inputRelease(e.button == 0, 'fire');
    });

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.inputPress(e.key == 'w', 'up');
      this.inputPress(e.key == 's', 'down');
      this.inputPress(e.key == 'a', 'left');
      this.inputPress(e.key == 'd', 'right');
    });

    document.addEventListener('keyup', (e) => {
      this.inputRelease(e.key == 'w', 'up');
      this.inputRelease(e.key == 's', 'down');
      this.inputRelease(e.key == 'a', 'left');
      this.inputRelease(e.key == 'd', 'right');
    });
  }

  setupMobileControls() {
    this.scene.game.interactive = true;

    const changeMove = (dir) => {
      this.moveDir = dir.clone();
    };

    const moveReticle = (e) => {
      const clickPos = new SAT.Vector(e.client.x, e.client.y);
      this.mousePos = clickPos.sub(this.scene.game.position);
      this.reticle.x = e.clientX;
      this.reticle.y = e.clientY;

      if (!this.pressed.includes('fire')) {
        this.inputPress(true, 'fire');
      }
    };

    this.scene.game.on('pointerdown', (e) => {
      moveReticle(e);
    });
    this.scene.game.on('pointerup', (e) => {
      this.inputRelease(true, 'fire');
    });
    this.scene.game.on('pointerupoutside', (e) => {
      this.inputRelease(true, 'fire');
    });
    this.scene.game.on('pointermove', (e) => {
      moveReticle(e);
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
      changeMove(new SAT.Vector(0, 0));
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

      changeMove(joyToCenter.clone());
    });

    this.scene.mobileUI.addChild(joyStickBG);
    this.scene.mobileUI.addChild(joyStickOutline);
    this.scene.mobileUI.addChild(this.joyStick);
  }
}

export default Input;
