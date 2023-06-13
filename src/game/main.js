import { Application, Container, SCALE_MODES, utils } from 'pixi.js';
import Loader from './Loader';
import Game from './Game/Game';
import Input from './Input';

const Setup = () => {
  // Create Application
  const app = new Application({
    width: 256,
    height: 256,
    backgroundColor: 0x000000,
  });

  const windowWidth = window.innerWidth;
  app.spriteScale = 1;

  // Resize app to fit window
  if (windowWidth > 512) {
    app.spriteScale = 2;
  } else {
    app.spriteScale = windowWidth / 256;
  }

  app.resizeTo = window;

  app.isMobile = utils.isMobile.any;
  app.debug = false;

  // Append to DOM
  document.querySelector('#app').appendChild(app.view);

  // Load Assets
  Loader(app)
    .then((spriteSheet) => {
      spriteSheet.baseTexture.setStyle(SCALE_MODES.NEAREST);
      app.spriteSheet = spriteSheet;

      app.currentScene = new Container();
      app.stage.addChild(app.currentScene);

      app.input = new Input(app);

      // Start game
      const scene = Game(app);
      scene.loadScene();
    })
    .catch((err) => {
      console.log(err);
    });
};

export default Setup;