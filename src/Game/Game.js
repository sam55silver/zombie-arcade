import { Sprite, Container } from 'pixi.js';
import Player from './Player';
import Input from './Input';
import ZombieSpawner from './zombieSpawner';
import SAT from 'sat';
import UIContainer from './UIContainer';
import Scene from '../Scene';

const Game = (app) => {
  // create scene for game to be added to
  const scene = new Scene(app);

  scene.game = new Container();
  scene.gamePos = new SAT.Vector(
    app.renderer.width / 2,
    app.renderer.height / 2
  );

  scene.game.x = scene.gamePos.x;
  scene.game.y = scene.gamePos.y;
  scene.addChild(scene.game);

  // Debug mode
  if (app.debug) {
    scene.debug = new Container();
    scene.addChild(scene.debug);
  }

  if (app.isMobile) {
    scene.game.y -= 50 * scene.spriteScale;

    scene.mobileUI = new Container();
    scene.mobileUI.screenHeight = app.renderer.height;
    scene.mobileUI.screenWidth = app.renderer.width;
    scene.addChild(scene.mobileUI);
  }

  // Add sprite sheet to scene
  scene.spriteSheet = app.spriteSheet;

  scene.isMobile = app.isMobile;

  // Add view to scene
  scene.stage = app.stage;

  scene.input = new Input(scene);

  // Create a function to load images centered
  const loadImageCentered = (texture) => {
    const image = new Sprite(app.spriteSheet.textures[texture]);
    image.anchor.set(0.5);
    image.scale.set(scene.spriteScale);

    return image;
  };

  // Create map
  const map = loadImageCentered('map.png');
  // Calculate map dimensions
  const mapDimensions = {
    width: map.width,
    height: map.height,
    x: map.x,
    y: map.y,
  };

  // Calculate map borders i.e. the area where zombies can spawn
  const mapArea = {
    topLeft: {
      x: mapDimensions.x - mapDimensions.width / 2,
      y: mapDimensions.y - mapDimensions.height / 2,
    },
    bottomRight: {
      x: mapDimensions.x + mapDimensions.width / 2,
      y: mapDimensions.y + mapDimensions.height / 2,
    },
    topRight: {
      x: mapDimensions.x + mapDimensions.width / 2,
      y: mapDimensions.y - mapDimensions.height / 2,
    },
    bottomLeft: {
      x: mapDimensions.x - mapDimensions.width / 2,
      y: mapDimensions.y + mapDimensions.height / 2,
    },
  };

  const truePos = (pos) => [pos.x + scene.game.x, pos.y + scene.game.y];

  scene.map = {
    area: mapArea,
    walls: [
      // Top wall
      new SAT.Box(
        new SAT.Vector(...truePos(mapArea.topLeft)),
        mapDimensions.width,
        1
      ).toPolygon(),
      // Bottom wall
      new SAT.Box(
        new SAT.Vector(...truePos(mapArea.bottomLeft)),
        mapDimensions.width,
        1
      ).toPolygon(),
      // Left wall
      new SAT.Box(
        new SAT.Vector(...truePos(mapArea.topLeft)),
        1,
        mapDimensions.height
      ).toPolygon(),
      // Right wall
      new SAT.Box(
        new SAT.Vector(...truePos(mapArea.topRight)),
        1,
        mapDimensions.height
      ).toPolygon(),
    ],
  };

  scene.game.addChild(map);

  // add player to stage
  const gameArea = new Container();
  scene.gameArea = gameArea;
  scene.game.addChild(gameArea);

  // Create border for player to stay in
  scene.game.addChild(loadImageCentered('arena-border.png'));

  const player = new Player(scene);
  scene.gameArea.addChild(player);
  scene.player = player;

  // add kill count
  const updateKillCount = (ui) => {
    ui.count++;
    let countString = ui.count.toString();
    const zerosToAdd = 3 - countString.length;
    for (let i = 0; i < zerosToAdd; i++) {
      countString = '0' + countString;
    }

    for (let i = 0; i < ui.units.length; i++) {
      ui.units[i].update(countString[i]);
    }
  };

  const killCount = new UIContainer(
    scene,
    'kill-ui',
    3,
    {
      x: mapArea.topRight.x - 26 * scene.spriteScale,
      y: mapArea.topRight.y - 24 * scene.spriteScale,
    },
    updateKillCount
  );
  killCount.icon.x = -killCount.icon.width - 4;
  killCount.count = 0;

  scene.game.addChild(killCount);
  scene.killCount = killCount;

  // add Player health
  const updatePlayerHealth = (ui) => {
    const timesHit = scene.player.timesHit;
    const maxHealth = scene.player.maxHealth;
    for (let i = 1; i <= timesHit; i++) {
      ui.units[maxHealth - i].update('1');
    }
  };

  const playerHealth = new UIContainer(
    scene,
    'health-ui',
    scene.player.maxHealth,
    {
      x: mapArea.topLeft.x,
      y: mapArea.topLeft.y - 24 * scene.spriteScale,
    },
    updatePlayerHealth
  );
  playerHealth.icon.y = playerHealth.icon.height + 6;

  scene.game.addChild(playerHealth);
  scene.playerHealth = playerHealth;

  // Start the zombie spawner
  ZombieSpawner(scene);

  const gameLoop = (delta) => {
    scene.input.update();
    scene.gameArea.children.forEach((child) => {
      if (child.update) {
        child.update(delta);
      }
    });
  };

  scene.addLoop(gameLoop);

  return scene;
};

export default Game;
