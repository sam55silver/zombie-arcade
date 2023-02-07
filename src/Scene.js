import { Container } from 'pixi.js';

class Scene extends Container {
  constructor(app) {
    super();
    this.app = app;
    this.spriteScale = app.spriteScale;
  }

  loadScene() {
    this.app.stage.addChild(this);
  }

  removeScene() {
    this.app.stage.removeChild(this);
    if (this.loop) {
      this.app.ticker.remove(this.loop);
    }

    this.destroy({
      children: true,
    });
  }

  addLoop(loopCallback) {
    this.loop = loopCallback.bind(this);
    this.app.ticker.add(this.loop);
  }
}

export default Scene;
