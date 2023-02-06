import { Sprite, Container, Ticker } from 'pixi.js';
import Player from './Player';
import Input from './Input';
import ZombieSpawner from './zombieSpawner';
import SAT from 'sat';
import UIContainer from './UIContainer';

const Game = (app) => {
  // create scene for game to be added to
  const scene = new Container();
  // app.stage.addChild(scene);

  // Add sprite sheet to scene
  scene.spriteSheet = app.spriteSheet;

  // Add view to scene
  scene.view = app.view;

  // Add input to app
  scene.input = new Input();

  // Create a function to load images centered
  const loadImageCentered = (texture, offset) => {
    const image = new Sprite(app.spriteSheet.textures[texture]);
    image.anchor.set(0.5);
    image.scale.set(2);
    image.x = app.renderer.width / 2;
    image.y = app.renderer.height / 2;

    if (offset) {
      image.x += offset[0];
      image.y += offset[1];
    }

    return image;
  };

  // Create map
  const map = loadImageCentered('map.png', [0, 17]);
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

  scene.map = {
    area: mapArea,
    walls: [
      // Top wall
      new SAT.Box(
        new SAT.Vector(mapArea.topLeft.x, mapArea.topLeft.y - 10),
        mapDimensions.width,
        10
      ).toPolygon(),
      // Bottom wall
      new SAT.Box(
        new SAT.Vector(mapArea.bottomLeft.x, mapArea.bottomLeft.y),
        mapDimensions.width,
        10
      ).toPolygon(),
      // Left wall
      new SAT.Box(
        new SAT.Vector(mapArea.topLeft.x - 10, mapArea.topLeft.y),
        10,
        mapDimensions.height
      ).toPolygon(),
      // Right wall
      new SAT.Box(
        new SAT.Vector(mapArea.topRight.x, mapArea.topRight.y),
        10,
        mapDimensions.height
      ).toPolygon(),
    ],
  };

  scene.addChild(map);

  // add player to stage
  const gameArea = new Container();
  scene.gameArea = gameArea;
  scene.addChild(gameArea);

  // Create border for player to stay in
  scene.addChild(loadImageCentered('arena-border.png'));

  const player = new Player(scene);
  scene.gameArea.addChild(player);
  scene.player = player;

  // add kill count
  const updateKillCount = (ui) => {
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
      x: mapArea.topRight.x - 50,
      y: mapArea.topRight.y - 48,
    },
    updateKillCount
  );
  killCount.icon.x = -killCount.icon.width - 4;
  scene.addChild(killCount);
  scene.killCount = killCount;

  // add Player health
  const updatePlayerHealth = (ui) => {
    ui.units[ui.units.length - ui.count].update('1');
  };

  const playerHealth = new UIContainer(
    scene,
    'health-ui',
    8,
    {
      x: mapArea.topLeft.x,
      y: mapArea.topLeft.y - 48,
    },
    updatePlayerHealth
  );
  playerHealth.icon.y = playerHealth.icon.height + 6;
  scene.addChild(playerHealth);
  scene.playerHealth = playerHealth;

  // Start the zombie spawner
  ZombieSpawner(scene);

  scene.loop = (delta) => {
    scene.gameArea.children.forEach((child) => {
      console.log(child);
      if (child.update) {
        child.update(delta);
      }
    });
  };

  return scene;
};

export default Game;
