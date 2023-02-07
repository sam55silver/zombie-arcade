import SAT from 'sat';

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
