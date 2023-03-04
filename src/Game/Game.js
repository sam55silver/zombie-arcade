import { Sprite, Container, AnimatedSprite, Text } from 'pixi.js';
import Player from './Player';
import Input from '../Input';
import ZombieSpawner from './zombieSpawner';
import SAT from 'sat';
import UIContainer from './UIContainer';
import Scene from '../Scene';

const Game = (app) => {
  // create scene for game to be added to
  const scene = new Scene(app);
  scene.input = app.input;

  scene.gameOver = false;

  scene.game = new Container();
  scene.gamePos = new SAT.Vector(
    app.renderer.width / 2,
    app.renderer.height / 2
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
    scene.game.y -= 50 * scene.spriteScale;

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

  // Show controls
  const controls = new Container();
  controls.y += map.height * (1 / 5);
  scene.game.addChild(controls);

  const controlsTextStyle = {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0x1fc24a,
    align: 'center',
    fontStyle: 'bold',
  };

  if (app.isMobile) {
    const joystickControls = new Container();
    joystickControls.x -= map.width * (1 / 5);
    controls.addChild(joystickControls);

    const joystick = new Sprite(app.spriteSheet.textures['joystick.png']);
    joystick.x += joystick.width / 2;
    joystickControls.addChild(joystick);

    joystick.anchor.set(0.5);
    joystick.scale.set(scene.spriteScale);

    const spin = new Sprite(app.spriteSheet.textures['joymove.png']);
    spin.x -= joystick.width / 2;
    joystickControls.addChild(spin);

    spin.anchor.set(0.5);
    spin.scale.set(scene.spriteScale);

    const movementText = new Text('Move', controlsTextStyle);
    movementText.anchor.set(0.5);
    movementText.y += movementText.height + scene.spriteScale * 1.5;
    joystickControls.addChild(movementText);

    const lookControls = new Container();
    lookControls.x += map.width * (1 / 5);
    controls.addChild(lookControls);

    const hand = new Sprite(app.spriteSheet.textures['touch.png']);
    hand.x += hand.width / 2;
    lookControls.addChild(hand);

    hand.anchor.set(0.5);
    hand.scale.set(scene.spriteScale);

    const movement = new Sprite(app.spriteSheet.textures['movement.png']);
    movement.x -= movement.width / 2;
    lookControls.addChild(movement);

    movement.anchor.set(0.5);
    movement.scale.set(scene.spriteScale);

    const lookText = new Text('Shoot', controlsTextStyle);
    lookText.anchor.set(0.5);
    lookText.y += lookText.height + scene.spriteScale * 1.5;
    lookControls.addChild(lookText);
  } else {
    const movementKeys = new Container();
    movementKeys.x -= map.width * (2 / 7);
    controls.addChild(movementKeys);

    const wKey = new Sprite(app.spriteSheet.textures['w.png']);
    wKey.anchor.set(0.5);
    wKey.scale.set(scene.spriteScale);
    wKey.y -= wKey.height;
    movementKeys.addChild(wKey);

    const aKey = new Sprite(app.spriteSheet.textures['a.png']);
    aKey.anchor.set(0.5);
    aKey.scale.set(scene.spriteScale);
    aKey.x -= aKey.width;
    movementKeys.addChild(aKey);

    const sKey = new Sprite(app.spriteSheet.textures['s.png']);
    sKey.anchor.set(0.5);
    sKey.scale.set(scene.spriteScale);
    movementKeys.addChild(sKey);

    const dKey = new Sprite(app.spriteSheet.textures['d.png']);
    dKey.anchor.set(0.5);
    dKey.scale.set(scene.spriteScale);
    dKey.x += dKey.width;
    movementKeys.addChild(dKey);

    const moveText = new Text('Move', controlsTextStyle);
    moveText.anchor.set(0.5);
    moveText.y += moveText.height + scene.spriteScale * 1.5;
    movementKeys.addChild(moveText);

    const lookKeys = new Container();
    // lookKeys.y += 125 * scene.spriteScale;
    controls.addChild(lookKeys);

    const mouse = new Sprite(app.spriteSheet.textures['mouse.png']);
    mouse.anchor.set(0.5);
    mouse.scale.set(scene.spriteScale);
    mouse.x += mouse.width / 2;
    lookKeys.addChild(mouse);

    const movement = new Sprite(app.spriteSheet.textures['movement.png']);
    movement.anchor.set(0.5);
    movement.scale.set(scene.spriteScale);
    movement.x -= movement.width / 2;
    lookKeys.addChild(movement);

    const lookText = new Text('Look', controlsTextStyle);
    lookText.anchor.set(0.5);
    lookText.y += lookText.height + scene.spriteScale * 1.5;
    lookKeys.addChild(lookText);

    const shootKeys = new Container();
    shootKeys.x += map.width * (2 / 7);
    controls.addChild(shootKeys);

    const fire = new Sprite(app.spriteSheet.textures['mouse-click.png']);
    fire.anchor.set(0.5);
    fire.scale.set(scene.spriteScale);
    shootKeys.addChild(fire);

    const fireText = new Text('Shoot', controlsTextStyle);
    fireText.anchor.set(0.5);
    fireText.y += fireText.height + scene.spriteScale * 1.5;
    shootKeys.addChild(fireText);
  }

  // After time, remove controls and bring on the zombies!
  setTimeout(() => {
    scene.game.removeChild(controls);
    ZombieSpawner(scene);
  }, 6000);

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
