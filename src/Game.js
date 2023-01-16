import { Sprite, AnimatedSprite, Container } from 'pixi.js';
import Player from './Player';

const Game = (app, spriteSheet) => {
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

  // Create Game window and add to app
  const gameWindow = new Container();
  gameWindow.addChild(loadImageCentered('./Art/GameWindow/map.png', [0, 17]));
  gameWindow.addChild(
    loadImageCentered('./Art/GameWindow/GameplayAreaBorder.png')
  );

  app.stage.addChild(gameWindow);

  // add player to stage
  const player = new Player(app, spriteSheet);

  app.stage.addChild(player);

  // const player = new AnimatedSprite(spriteSheet.animations['PlayerGunShot']);

  // player.x = 512 / 2;
  // player.y = 512 / 2;
  // // player.anchor.set(0.5);

  // player.animationSpeed = 0.1;
  // // player.play();

  // app.stage.addChild(player);

  // Start the game loop
  app.ticker.add((delta) => {
    // Update the current game state:
    player.update(delta);
  });
};

export default Game;
