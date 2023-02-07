class Input {
  constructor() {
    this.pressed = [];
    this.mousePos = { x: 0, y: 0 };

    const app = document.getElementById('app');

    app.addEventListener('mousedown', (e) =>
      this.inputPress(e.button == 0, 'fire')
    );
    app.addEventListener('mouseup', (e) =>
      this.inputRelease(e.button == 0, 'fire')
    );

    app.addEventListener('mousemove', (e) => {
      const rect = app.getBoundingClientRect();
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    });

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      console.log('keydown', e.key);
      this.inputPress(e.key == 'w', 'up');
      this.inputPress(e.key == 's', 'down');
      this.inputPress(e.key == 'a', 'left');
      this.inputPress(e.key == 'd', 'right');
    });

    document.addEventListener('keyup', (e) => {
      console.log('keyup', e.key);
      this.inputRelease(e.key == 'w', 'up');
      this.inputRelease(e.key == 's', 'down');
      this.inputRelease(e.key == 'a', 'left');
      this.inputRelease(e.key == 'd', 'right');
    });
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
