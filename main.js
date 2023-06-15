import './style.css';
import {
  Application,
  Container,
  NoiseFilter,
  SCALE_MODES,
  utils,
} from 'pixi.js';
import Loader from './src/Loader';
import displayLeaderBoard from './src/LeaderBoard/displayLeaderBoard';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig.json';
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom';
import { BulgePinchFilter } from '@pixi/filter-bulge-pinch';
import { CRTFilter } from '@pixi/filter-crt';

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
  const windowHeight = window.innerHeight;
  app.spriteScale = 1;

  // Resize app to fit window
  if (windowWidth > 1024 && windowHeight > 1024) {
    app.renderer.resize(1024, 1024);
    app.spriteScale = 4;
  } else if (windowWidth > 768 && windowHeight > 768) {
    app.renderer.resize(768, 768);
    app.spriteScale = 3;
  } else if (windowWidth > 512 && windowHeight > 512) {
    app.renderer.resize(512, 512);
    app.spriteScale = 2;
  }

  console.log(app.spriteScale);

  app.isMobile = utils.isMobile.any;
  app.debug = false;

  app.currentScene = new Container();
  app.stage.addChild(app.currentScene);

  // add filter to app
  app.currentScene.filters = [
    new AdvancedBloomFilter({
      threshold: 0.4,
      bloomScale: 0.3,
      brightness: 1,
      blur: 1,
    }),

    new CRTFilter({
      curvature: 1,
      lineWidth: 1,
      lineContrast: 0.4,
      noise: 0.1,
      noiseSize: 1,
      vignetting: 0.5,
      vignettingAlpha: 0.1,
      vignettingBlur: 0.1,
    }),
  ];

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
