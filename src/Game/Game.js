import { Sprite, Container, Text } from 'pixi.js';
import Player from './Components/Player';
import Spawner from './Components/zombieSpawner';
import SAT from 'sat';
import UIContainer from './Components/UIContainer';
import Scene from '../Scene';
import { CollectibleSpawner } from './Components/Collectibles';
import Input from './Input';
import fonts from '../fonts.json';

const Game = (app) => {
  // create scene for game to be added to
  const scene = new Scene(app);
  scene.input = new Input(app);
  scene.app = app;

  scene.gameOver = false;

  scene.game = new Container();
  scene.gamePos = new SAT.Vector(
    app.renderer.width / 2,
    app.renderer.height / 2 + 10 * scene.spriteScale
  );

  scene.game.x = scene.gamePos.x;
  scene.game.y = scene.gamePos.y;
  scene.addChild(scene.game);

  // create zombie list to add to and keep track of in app
  scene.zombies = [];

  // Debug mode
  if (app.debug) {
    scene.debug = new Container();
    scene.addChild(scene.debug);
  }

  if (app.isMobile) {
    scene.game.y -= 55 * scene.spriteScale;

    scene.mobileUI = new Container();
    scene.mobileUI.screenHeight = app.renderer.height;
    scene.mobileUI.screenWidth = app.renderer.width;
    scene.addChild(scene.mobileUI);
    scene.input.setupMobileControls(scene);
  }

  // Add sprite sheet to scene
  scene.spriteSheet = app.spriteSheet;

  scene.isMobile = app.isMobile;

  // Add view to scene
  scene.stage = app.stage;

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
      x: mapDimensions.x - mapDimensions.width / 2 - 1,
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

  // Layer for dead zombies
  scene.deadZombies = new Container();
  scene.game.addChild(scene.deadZombies);

  // add player to stage
  scene.gameArea = new Container();
  scene.game.addChild(scene.gameArea);

  // collectibles
  scene.collectibles = new Container();
  scene.gameArea.addChild(scene.collectibles);

  // add update to collectibles
  scene.collectibles.update = (delta, elapsedMS) => {
    scene.collectibles.children.forEach((child) => {
      if (child.update) {
        child.update(delta, elapsedMS);
      }
    });
  };

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
    const maxHealth = scene.player.maxHealth;
    const health = maxHealth - scene.player.timesHit;

    for (let i = 0; i < maxHealth; i++) {
      ui.units[i].update('1');
    }

    for (let i = 0; i < health; i++) {
      ui.units[i].update('0');
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

  // Show controls
  const controls = new Container();
  controls.y += map.height * (1 / 5);
  scene.game.addChild(controls);

  const controlsTextStyle = {
    ...fonts.entryStyle,
    fontSize: 10 * scene.spriteScale,
  };

  const vertical_spacing = 24 * scene.spriteScale;
  const horizontal_spacing = 65 * scene.spriteScale;
  const mobile_horizontal_spacing = 12 * scene.spriteScale;
  const mobile_scale = 1.5 * scene.spriteScale;

  if (app.isMobile) {
    const joystickControls = new Container();
    joystickControls.x -= map.width * (1 / 5);
    controls.addChild(joystickControls);

    const joystick = new Sprite(app.spriteSheet.textures['joystick.png']);
    joystick.x += mobile_horizontal_spacing;
    joystickControls.addChild(joystick);

    joystick.anchor.set(0.5);
    joystick.scale.set(mobile_scale);

    const spin = new Sprite(app.spriteSheet.textures['rotation.png']);
    spin.x -= mobile_horizontal_spacing;
    joystickControls.addChild(spin);

    spin.anchor.set(0.5);
    spin.scale.set(mobile_scale);

    const movementText = new Text('MOVE', controlsTextStyle);
    movementText.anchor.set(0.5);
    movementText.y += vertical_spacing;
    joystickControls.addChild(movementText);

    const lookControls = new Container();
    lookControls.x += map.width * (1 / 5);
    controls.addChild(lookControls);

    const hand = new Sprite(app.spriteSheet.textures['finger.png']);
    hand.x += mobile_horizontal_spacing * 1.1;
    lookControls.addChild(hand);

    hand.anchor.set(0.5);
    hand.scale.set(mobile_scale);

    const movement = new Sprite(app.spriteSheet.textures['move.png']);
    movement.x -= mobile_horizontal_spacing * 1.1;
    lookControls.addChild(movement);

    movement.anchor.set(0.5);
    movement.scale.set(mobile_scale);

    const lookText = new Text('SHOOT', controlsTextStyle);
    lookText.anchor.set(0.5);
    lookText.y += vertical_spacing;
    lookControls.addChild(lookText);
  } else {
    const movementKeys = new Container();
    movementKeys.x -= horizontal_spacing;
    controls.addChild(movementKeys);

    const keys = new Container();
    keys.y += 4 * scene.spriteScale;
    movementKeys.addChild(keys);

    const wKey = new Sprite(app.spriteSheet.textures['w.png']);
    wKey.anchor.set(0.5);
    wKey.scale.set(scene.spriteScale);
    wKey.y -= wKey.height;
    keys.addChild(wKey);

    const aKey = new Sprite(app.spriteSheet.textures['a.png']);
    aKey.anchor.set(0.5);
    aKey.scale.set(scene.spriteScale);
    aKey.x -= aKey.width;
    keys.addChild(aKey);

    const sKey = new Sprite(app.spriteSheet.textures['s.png']);
    sKey.anchor.set(0.5);
    sKey.scale.set(scene.spriteScale);
    keys.addChild(sKey);

    const dKey = new Sprite(app.spriteSheet.textures['d.png']);
    dKey.anchor.set(0.5);
    dKey.scale.set(scene.spriteScale);
    dKey.x += dKey.width;
    keys.addChild(dKey);

    const moveText = new Text('MOVE', controlsTextStyle);
    moveText.anchor.set(0.5);
    moveText.y += vertical_spacing;
    movementKeys.addChild(moveText);

    const lookKeys = new Container();
    controls.addChild(lookKeys);

    const mouse = new Sprite(app.spriteSheet.textures['mouse.png']);
    mouse.anchor.set(0.5);
    mouse.scale.set(scene.spriteScale * 1.2);
    mouse.x += mouse.width / 2;
    lookKeys.addChild(mouse);

    const movement = new Sprite(app.spriteSheet.textures['move.png']);
    movement.anchor.set(0.5);
    movement.scale.set(scene.spriteScale * 1.2);
    movement.x -= movement.width / 2;
    lookKeys.addChild(movement);

    const lookText = new Text('LOOK', controlsTextStyle);
    lookText.anchor.set(0.5);
    lookText.y += vertical_spacing;
    lookKeys.addChild(lookText);

    const shootKeys = new Container();
    shootKeys.x += horizontal_spacing;
    controls.addChild(shootKeys);

    const fire = new Sprite(app.spriteSheet.textures['mouse-click.png']);
    fire.anchor.set(0.5);
    fire.scale.set(scene.spriteScale * 1.2);
    shootKeys.addChild(fire);

    const fireText = new Text('SHOOT', controlsTextStyle);
    fireText.anchor.set(0.5);
    fireText.y += vertical_spacing;
    shootKeys.addChild(fireText);
  }

  const spawners = [];
  const spawnAtKills = 20;
  let spawnZombie = true;

  // After time, remove controls and bring on the zombies!
  scene.startTimeout(() => {
    scene.game.removeChild(controls);
    spawners.push(new Spawner(scene));
    new CollectibleSpawner(scene);
  }, 6000);

  const gameLoop = (delta) => {
    const elapsedMS = app.ticker.elapsedMS;

    scene.input.update();
    scene.gameArea.children.forEach((child) => {
      if (child.update) {
        child.update(delta, elapsedMS);
      }
    });

    // check if user has kill count divisible by 40
    if (
      scene.killCount.count % spawnAtKills === 0 &&
      scene.killCount.count != 0 &&
      spawnZombie
    ) {
      // if so, spawn a new spawner
      spawners.push(new Spawner(scene));
      spawnZombie = false;
    }

    if (scene.killCount.count % spawnAtKills != 0) {
      spawnZombie = true;
    }
  };

  scene.addLoop(gameLoop);

  return scene;
};

export default Game;
