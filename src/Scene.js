import { Container } from 'pixi.js';

class Scene extends Container {
  constructor(app) {
    super();
    this.app = app;
    this.spriteScale = app.spriteScale;

    this.timeouts = [];
  }

  startTimeout(callback, time) {
    const execute = callback.bind(this);

    const timeout = (delta) => {
      // elapsed time in milliseconds
      const elapsedTime = this.app.ticker.elapsedMS;

      if (time <= 0) {
        execute();
        this.timeouts.splice(this.timeouts.indexOf(execute), 1);
        this.app.ticker.remove(timeout);
      } else {
        time -= elapsedTime;
      }
    };

    this.timeouts.push(timeout);
    this.app.ticker.add(timeout);
  }

  loadScene() {
    this.app.currentScene.addChild(this);
  }

  removeScene() {
    this.app.currentScene.removeChild(this);
    if (this.timeouts.length > 0) {
      this.timeouts.forEach((timeout) => {
        this.app.ticker.remove(timeout);
      });
      this.timeouts = [];
    }
    if (this.loop) {
      this.app.ticker.remove(this.loop);
    }

    this.destroy({
      children: true,
    });
  }

  changeScene(scene) {
    this.removeScene();
    scene.loadScene();
  }

  addLoop(loopCallback) {
    this.loop = loopCallback.bind(this);
    this.app.ticker.add(this.loop);
  }
}

export default Scene;
