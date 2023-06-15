import { Container, Text, AnimatedSprite } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import fonts from '../fonts.json';
import Button from './button';
import get_leader_board from './getLeaderBoard';

const display_leader_board = (app) => {
  const leaderBoard = new Scene(app);
  leaderBoard.x = app.renderer.width / 2;

  get_leader_board(app.db)
    .then((scores) => {
      app.high_scores = scores;
      console.log(scores);

      const leaderBoardText = new Text('Leader Board!', fonts.headerStyle);
      leaderBoardText.anchor.set(0.5);
      leaderBoard.addChild(leaderBoardText);
      leaderBoardText.y = app.renderer.height / 4;

      let scoresContainer = new Container();
      scoresContainer.y = leaderBoardText.y + leaderBoardText.height;
      leaderBoard.addChild(scoresContainer);

      app.high_scores.forEach((entry, index) => {
        let entryContainer = new Container();

        let spacing_distance = 200;

        let numText = new Text(`${index + 1}.`, fonts.entryStyle);
        numText.x = -spacing_distance;

        let nameText = new Text(`${entry.name}`, fonts.entryStyle);
        nameText.x = -spacing_distance + 50;

        let scoreText = new Text(`${entry.score}`, fonts.entryStyle);
        scoreText.anchor.set(1, 0);
        scoreText.x = spacing_distance - 15;

        entryContainer.addChild(numText);
        entryContainer.addChild(nameText);
        entryContainer.addChild(scoreText);

        entryContainer.y = (index + 1) * 30;

        scoresContainer.addChild(entryContainer);
      });

      const button = Button(
        app.spriteSheet.textures['buttons/play-0.png'],
        0,
        app.renderer.height / 2,
        app.spriteScale,
        () => {
          // Start game
          const game = Game(app);
          leaderBoard.changeScene(game);
        }
      );
      leaderBoard.addChild(button);
    })
    .catch((error) => {
      console.log(error);

      leaderBoard.y = app.renderer.height / 2;

      const errorText = new Text(
        'Error loading leader board',
        fonts.headerStyle
      );
      errorText.anchor.set(0.5);
      leaderBoard.addChild(errorText);
    });

  return leaderBoard;
};

export default display_leader_board;
