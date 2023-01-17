import { Sprite, AnimatedSprite, Container } from 'pixi.js';
import Player from './Player';
import Input from './Input';
import Zombie from './Zombie';

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
  app.stage.addChild(loadImageCentered('./Art/GameWindow/map.png', [0, 17]));

  // add player to stage
  const player = new Player(app);
  app.stage.addChild(player);

  // Create border for player to stay in
  app.stage.addChild(
    loadImageCentered('./Art/GameWindow/GameplayAreaBorder.png')
  );

  const zombie = new Zombie(app, 1, { x: 100, y: 100 });
  app.stage.addChild(zombie);

  // Start the game loop
  app.ticker.add((delta) => {
    // Update the current game state:
    player.update(delta);
  });
};

export default Game;
