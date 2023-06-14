import { Container, Text, AnimatedSprite } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import Input from '../Game/Input';
import fonts from '../fonts.json';
import Button from './button';
import display_leader_board from './displayLeaderBoard';

const GameOverScore = (app, killCount) => {
  const scene = new Scene(app);
  scene.x = app.renderer.width / 2;

  const headerText = new Text('Game Over', {
    ...fonts.headerStyle,
    'fontSize': 30,
    'fill': '0xc7383c',
  });
  headerText.anchor.set(0.5);
  headerText.y = app.renderer.height / 4;

  scene.addChild(headerText);

  const score = new Text(killCount, {
    ...fonts.headerStyle,
    'fontSize': 40,
    'fill': '0xc7383c',
  });

  score.anchor.set(0.5);
  score.y = app.renderer.height / 2;

  scene.addChild(score);

  //   const bottomHalf = isHighScore(high_scores, killCount)
  //     ? NewHighScore(app, killCount)
  //     : ShowScore(app);

  //   scene.addChild(bottomHalf);

  const retryButton = Button(
    app.spriteSheet.textures['buttons/retry-0.png'],
    0,
    app.renderer.height * (7 / 10),
    app.spriteScale,
    () => {
      // Start game
      const game = Game(app);
      scene.changeScene(game);
    }
  );
  scene.addChild(retryButton);

  const menuButton = Button(
    app.spriteSheet.textures['buttons/death-screen-menu-0.png'],
    0,
    app.renderer.height * (8 / 10),
    app.spriteScale,
    () => {
      const leaderBoard = display_leader_board(app);
      scene.changeScene(leaderBoard);
    }
  );
  scene.addChild(menuButton);

  //   scene.loadScene();
  return scene;
};

const isHighScore = (high_scores, killCount) => {
  high_scores.forEach((entry) => {
    if (killCount > entry.score) {
      return true;
    }
  });

  return false;
};

const NewHighScore = (app, killCount) => {
  const container = new Container();

  const highScoreText = new Text('New High Score!', fonts.entryStyle);
  highScoreText.anchor.set(0.5);
  highScoreText.y = app.renderer.height / 2 + 50;
  container.addChild(highScoreText);

  return container;
};

const ShowScore = (app) => {
  return 'show score';
};

export default GameOverScore;
