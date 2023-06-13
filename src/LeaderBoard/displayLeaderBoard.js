import { Container, Text } from 'pixi.js';

const display_leader_board = (app, high_scores) => {
  const leaderBoard = new Container();
  leaderBoard.x = app.renderer.width / 2;
  //   leaderBoard.y = app.renderer.height / 2;
  app.stage.addChild(leaderBoard);

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

  high_scores.forEach((entry, index) => {
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
};

export default display_leader_board;
