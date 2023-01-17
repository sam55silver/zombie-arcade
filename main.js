import './style.css';
import { Application } from 'pixi.js';
import Loader from './src/Loader';
import Game from './src/Game';

const Setup = () => {
  // Create Application
  const app = new Application({
    width: 512,
    height: 512,
    backgroundColor: 0x000000,
  });

  // Append to DOM
  document.querySelector('#app').appendChild(app.view);

  // Load Assets
  Loader(app)
    .then((spriteSheet) => {
      // Add spriteSheet to app
      app.spriteSheet = spriteSheet;

      // Start game
      Game(app);
    })
    .catch((err) => {
      console.log(err);
    });
};

Setup();
