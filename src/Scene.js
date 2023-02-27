import { Container } from 'pixi.js';

class Scene extends Container {
  constructor(app) {
    super();
    this.app = app;
    this.spriteScale = app.spriteScale;
  }

  loadScene() {
    this.app.currentScene.addChild(this);
  }

  removeScene() {
    this.app.currentScene.removeChild(this);
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
