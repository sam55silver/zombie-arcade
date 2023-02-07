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

  const windowWidth = window.innerWidth;
  app.spriteScale = 1;

  // Resize app to fit window
  if (windowWidth > 512) {
    app.spriteScale = 2;
    app.renderer.resize(512, 512);
  } else {
    app.spriteScale = windowWidth / 256;
    app.renderer.resize(windowWidth, windowWidth);
  }

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

      let sceneActive = true;

      // Remove game scene
      const sceneBtn = document.querySelector('#game-scene');
      sceneBtn.addEventListener('click', () => {
        if (sceneActive) {
          scene.removeScene();

          sceneBtn.innerHTML = 'Add Scene';
          sceneActive = false;
        } else {
          scene = Game(app);
          scene.loadScene();

          sceneBtn.innerHTML = 'Remove Scene';
          sceneActive = true;
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

Setup();
