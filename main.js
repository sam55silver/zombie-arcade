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
      let gameScene = Game(app);
      app.stage.addChild(gameScene);
      app.ticker.add((delta) => gameScene.loop(delta));

      let sceneActive = true;

      // Remove game scene
      const sceneBtn = document.querySelector('#game-scene');
      sceneBtn.addEventListener('click', () => {
        if (sceneActive) {
          app.stage.removeChild(gameScene);
          gameScene.ticker.stop();

          gameScene.destroy({
            children: true,
          });

          gameScene = null;
          console.log(gameScene);

          sceneBtn.innerHTML = 'Add Scene';
          sceneActive = false;
        } else {
          gameScene = Game(app);
          app.stage.addChild(gameScene);
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
