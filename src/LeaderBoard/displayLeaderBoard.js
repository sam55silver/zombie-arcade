import { Container, Text, AnimatedSprite } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import Input from '../Game/Input';

const display_leader_board = (app) => {
  const leaderBoard = new Scene(app);
  leaderBoard.x = app.renderer.width / 2;
  //   leaderBoard.y = app.renderer.height / 2;

  const headerStyle = {
    fontFamily: 'Arial',
    fontSize: 40,
    fill: 0x1fc24a,
    align: 'center',
    fontStyle: 'bold',
  };

  const entryStyle = {
    fontFamily: 'Arial',
    fontSize: 20,
    fill: 0x1fc24a,
    align: 'center',
  };

  const leaderBoardText = new Text('Leader Board!', headerStyle);
  leaderBoardText.anchor.set(0.5);
  leaderBoard.addChild(leaderBoardText);
  leaderBoardText.y = app.renderer.height / 4;

  let scoresContainer = new Container();
  scoresContainer.y = leaderBoardText.y + leaderBoardText.height;
  leaderBoard.addChild(scoresContainer);

  app.high_scores.forEach((entry, index) => {
    let entryContainer = new Container();

    let spacing_distance = 200;

    let numText = new Text(`${index + 1}.`, entryStyle);
    numText.x = -spacing_distance;

    let nameText = new Text(`${entry.name}`, entryStyle);
    nameText.x = -spacing_distance + 50;

    let scoreText = new Text(`${entry.score}`, entryStyle);
    scoreText.anchor.set(1, 0);
    scoreText.x = spacing_distance - 15;

    entryContainer.addChild(numText);
    entryContainer.addChild(nameText);
    entryContainer.addChild(scoreText);

    entryContainer.y = (index + 1) * 30;

    scoresContainer.addChild(entryContainer);
  });

  const button = new AnimatedSprite(app.spriteSheet.animations['buttons/play']);
  button.anchor.set(0.5);
  button.scale.set(app.spriteScale);
  button.x = 0;
  button.y = app.renderer.height * (7 / 10);
  button.eventMode = 'dynamic';

  // change cursor to pointer
  // button.addEventListener('mouseover', () => {
  //   document.body.style.cursor = 'pointer';
  // });

  // button.addEventListener('mouseout', () => {
  //   document.body.style.cursor = 'default';
  // });

  button.addEventListener('pointertap', () => {
    // Start game
    app.input = new Input(app);
    const game = Game(app);
    leaderBoard.changeScene(game);
  });

  leaderBoard.addChild(button);

  leaderBoard.loadScene();
};

export default display_leader_board;
