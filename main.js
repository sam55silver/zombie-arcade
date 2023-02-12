import './style.css';
import { Application, SCALE_MODES, utils } from 'pixi.js';
import Loader from './src/Loader';
import Game from './src/Game/Game';

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

  // Append to DOM
  document.querySelector('#app').appendChild(app.view);

  // Load Assets
  Loader(app)
    .then((spriteSheet) => {
      app.spriteSheet = spriteSheet;
      spriteSheet.baseTexture.setStyle(SCALE_MODES.NEAREST);

      // Start game
      let scene = Game(app);
      scene.loadScene();
    })
    .catch((err) => {
      console.log(err);
    });
};

Setup();
