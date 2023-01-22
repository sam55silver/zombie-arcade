import { Sprite, Container } from 'pixi.js';
import Player from './Player';
import Input from './Input';
import ZombieSpawner from './zombieSpawner';
import SAT from 'sat';

const Game = (app) => {
  // Add input to app
  app.input = new Input();

  // Create a function to load images centered
  const loadImageCentered = (texture, offset) => {
    const image = Sprite.from(texture);
    image.anchor.set(0.5);
    image.x = app.renderer.width / 2;
    image.y = app.renderer.height / 2;

    if (offset) {
      image.x += offset[0];
      image.y += offset[1];
    }

    return image;
  };

  // Create map
  const map = loadImageCentered('./Art/GameWindow/map.png', [0, 17]);
  // Calculate map dimensions
  const mapDimensions = {
    width: map.texture.baseTexture.resource.source.width,
    height: map.texture.baseTexture.resource.source.height,
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

  app.map = {
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

  app.stage.addChild(map);

  // add player to stage
  const gameArea = new Container();
  app.gameArea = gameArea;
  app.stage.addChild(gameArea);

  const player = new Player(app);
  app.gameArea.addChild(player);
  app.player = player;

  // Create border for player to stay in
  app.stage.addChild(
    loadImageCentered('./Art/GameWindow/GameplayAreaBorder.png')
  );

  // Start the game loop
  app.ticker.add((delta) => {
    // Update the current game state:
    player.update(delta);
  });

  // Start the zombie spawner
  ZombieSpawner(app);
};

export default Game;
