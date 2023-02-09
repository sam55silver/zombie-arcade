import SAT from 'sat';
import { Sprite } from 'pixi.js';

class Input {
  constructor(scene) {
    this.scene = scene;

    this.pressed = [];
    this.isFiring = false;

    this.mousePos = new SAT.Vector(0, 0);
    this.moveDir = new SAT.Vector(0, 0);

    this.reticle = new Sprite(scene.spriteSheet.animations['reticle'][0]);
    this.reticle.anchor.set(0.5);
    this.reticle.scale.set(scene.spriteScale);
    scene.addChild(this.reticle);

    this.setupDesktopControls();
  }

  setupDesktopControls() {
    this.scene.stage.interactive = true;

    const inputPress = (keyPressed, action) => {
      if (keyPressed) this.pressed.push(action);
    };

    const inputRelease = (keyReleased, action) => {
      if (keyReleased) {
        this.pressed = this.pressed.filter((input) => input !== action);
      }
    };

    document.addEventListener('mousemove', (e) => {
      this.reticle.x = e.clientX;
      this.reticle.y = e.clientY;

      this.mousePos.x = e.clientX - this.scene.game.position.x;
      this.mousePos.y = e.clientY - this.scene.game.position.y;
      // this.mousePos.x = e.data.global.x;
      // this.mousePos.y = e.data.global.y;
    });
    document.addEventListener('mousedown', (e) => {
      inputPress(e.button == 0, 'fire');
    });
    document.addEventListener('mouseup', (e) => {
      inputRelease(e.button == 0, 'fire');
    });

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      inputPress(e.key == 'w', 'up');
      inputPress(e.key == 's', 'down');
      inputPress(e.key == 'a', 'left');
      inputPress(e.key == 'd', 'right');
    });

    document.addEventListener('keyup', (e) => {
      inputRelease(e.key == 'w', 'up');
      inputRelease(e.key == 's', 'down');
      inputRelease(e.key == 'a', 'left');
      inputRelease(e.key == 'd', 'right');
    });
  }

  setupMobileControls() {
    const changeMove = (dir) => {
      this.moveDir = dir.clone();
    };

    const moveReticle = (e) => {
      this.isFiring = true;
      const clickPos = new SAT.Vector(e.client.x, e.client.y);
      this.mousePos = clickPos.sub(scene.game.position);
    };

    this.scene.game.on('pointerdown', (e) => {
      moveReticle(e);
    });
    this.scene.game.on('pointerup', (e) => {
      this.isFiring = false;
    });
    scene.game.on('pointerupoutside', (e) => {
      this.isFiring = false;
    });
    scene.game.on('pointermove', (e) => {
      moveReticle(e);
    });
  }
}

export default Input;
