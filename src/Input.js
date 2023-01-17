import { Ticker } from 'pixi.js';

class Input {
  constructor() {
    this.inputs = {};
    this.currentInputs = [];

    document.addEventListener('keydown', this.keyDown.bind(this));
    document.addEventListener('keyup', this.keyUp.bind(this));

    this.ticker = Ticker.shared;
    this.ticker.add(this.update, this);
  }

  addInput(key, keyDown, keyUp) {
    this.inputs[key] = { keyUp, keyDown };
  }

  keyDown(e) {
    if (this.inputs[e.key]) this.currentInputs.push(e.key);
  }

  keyUp(e) {
    if (this.inputs[e.key]) {
      this.currentInputs = this.currentInputs.filter(
        (input) => input !== e.key
      );
      this.inputs[e.key].keyUp();
    }
  }

  update(delta) {
    // console.log(this.currentInputs);
    this.currentInputs.forEach((input) => {
      if (this.inputs[input]) this.inputs[input].keyDown(delta);
    });
  }
}

export default Input;
