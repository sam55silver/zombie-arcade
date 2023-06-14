import { Container, Text, AnimatedSprite } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import Input from '../Game/Input';

const GameOverScore = (app, killCount) => {
  console.log(findScorePosition(app, killCount));
};

const findScorePosition = (app, killCount) => {
  app.high_scores.forEach((entry) => {
    if (killCount > entry.score) {
      return NewHighScore(app);
    }
  });

  return ShowScore(app);
};

const NewHighScore = (app) => {
  const scene = new Scene(app);

  // To-do - make header style and entry style in json file

  return 'new high score';
};

const ShowScore = (app) => {
  return 'show score';
};

export default GameOverScore;
