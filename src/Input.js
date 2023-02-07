import SAT from 'sat';
import { Container, Graphics } from 'pixi.js';

class Input {
  constructor(scene) {
    this.pressed = [];
    this.mousePos = new SAT.Vector(0, 0);

    scene.interactive = true;

    scene.on('pointermove', (e) => {
      this.mousePos.x = e.data.global.x;
      this.mousePos.y = e.data.global.y;
    });
    scene.on('mousedown', (e) => {
      this.inputPress(e.button == 0, 'fire');
    });
    scene.on('mouseup', (e) => {
      this.inputRelease(e.button == 0, 'fire');
    });
    scene.on('tap', (e) => {
      this.tapInput('fire');
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

    // Spawn movement joy stick
    this.joyStickPos = new SAT.Vector(
      scene.map.area.bottomLeft.x + 20 * scene.spriteScale,
      scene.map.area.bottomLeft.y + 40 * scene.spriteScale
    );
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
      scene.player.moveDir = new SAT.Vector(0, 0);
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

      scene.player.moveDir = joyToCenter.clone();
    });

    scene.addChild(joyStickBG);
    scene.addChild(joyStickOutline);
    scene.addChild(this.joyStick);
  }

  tapInput(action) {
    this.pressed.push(action);
    setTimeout(() => {
      this.pressed = this.pressed.filter((input) => input !== action);
    }, 100);
  }

  inputPress(keyPressed, action) {
    if (keyPressed) this.pressed.push(action);
  }

  inputRelease(keyReleased, action) {
    if (keyReleased) {
      this.pressed = this.pressed.filter((input) => input !== action);
    }
  }
}

export default Input;
