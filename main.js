import './style.css';
import { Application, SCALE_MODES } from 'pixi.js';
import Loader from './src/Loader';
import Game from './src/Game';

const Setup = () => {
  // Create Application
  const app = new Application({
    width: 256,
    height: 256,
    backgroundColor: 0x000000,
  });

  app.renderer.resize(512, 512);

  // Append to DOM
  document.querySelector('#app').appendChild(app.view);

  // Load Assets
  Loader(app)
    .then((spriteSheet) => {
      app.spriteSheet = spriteSheet;
      spriteSheet.baseTexture.setStyle(SCALE_MODES.NEAREST);

      // Start game
      Game(app);
    })
    .catch((err) => {
      console.log(err);
    });
};

Setup();
