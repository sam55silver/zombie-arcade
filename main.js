import './style.css';
import { Application, Container, SCALE_MODES, utils } from 'pixi.js';
import Loader from './src/Loader';
import displayLeaderBoard from './src/LeaderBoard/displayLeaderBoard';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const Setup = () => {
  // Create Application
  const app = new Application({
    width: 256,
    height: 256,
    backgroundColor: 0x000000,
  });

  app.db = db;

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

  app.currentScene = new Container();
  app.stage.addChild(app.currentScene);

  // app.renderer.addSystem(EventSystem, 'events');

  // Append to DOM
  document.querySelector('#app').appendChild(app.view);

  // Load Assets
  Loader(app)
    .then((sheet) => {
      sheet.baseTexture.setStyle(SCALE_MODES.NEAREST);
      app.spriteSheet = sheet;

      const leaderBoard = displayLeaderBoard(app);
      leaderBoard.loadScene();
    })
    .catch((err) => {
      console.log(err);
    });
};

Setup();
