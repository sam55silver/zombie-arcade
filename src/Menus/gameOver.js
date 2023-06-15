import { Container, Graphics, Text } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import fonts from '../fonts.json';
import Button from './button';
import display_leader_board from './mainMenu';
import post_leader_board from '../LeaderBoard/postLeaderBoard';
import MainMenu from './mainMenu';

const GameOver = (app, killCount) => {
  const scene = new Scene(app);
  scene.x = app.renderer.width / 2;
  scene.y = app.renderer.height / 2;

  const headerText = new Text('Game Over', {
    ...fonts.headerStyle,
    'fontSize': 15 * app.spriteScale,
    'fill': '0xffffff',
  });
  headerText.anchor.set(0.5);
  headerText.y = -40 * app.spriteScale;

  scene.addChild(headerText);

  const score = new Text(killCount, {
    ...fonts.headerStyle,
    'fontSize': 25 * app.spriteScale,
    'fill': '0xc7383c',
  });
  score.anchor.set(0.5);
  scene.addChild(score);

  const highScorePosition = HighScorePosition(app.high_scores, killCount);

  if (highScorePosition) {
    NewHighScore(app, killCount, highScorePosition, scene);
  } else {
    ShowScore(app, scene);
  }

  return scene;
};

const HighScorePosition = (high_scores, killCount) => {
  let position = null;

  for (let i = 0; i < high_scores.length; i++) {
    if (killCount > high_scores[i].score) {
      position = i + 1;
      break;
    }
  }

  return position;
};

const NewHighScore = (app, killCount, highScorePosition, scene) => {
  const whiteEntryStyle = {
    ...fonts.entryStyle,
    'fill': '0xffffff',
  };

  const highScoreText = new Text('New High Score!', whiteEntryStyle);
  highScoreText.anchor.set(0.5);
  highScoreText.y = 30 * app.spriteScale;
  scene.addChild(highScoreText);

  // Input
  const input = new Container();
  scene.addChild(input);

  const width = 150 * app.spriteScale;
  const height = 20 * app.spriteScale;
  const radius = 5 * app.spriteScale;
  const y = 60 * app.spriteScale;

  const inputArea = new Graphics();
  inputArea.beginFill(0xffffff);
  inputArea.drawRoundedRect(-width / 2, -height / 2 + y, width, height, radius);
  inputArea.endFill();
  input.addChild(inputArea);

  // const inputText = new Text(
  //   `Enter a name to insert into ${highScorePosition}/9`,
  //   whiteEntryStyle
  // );
  // inputText.anchor.set(0.5);
  // inputText.y = app.renderer.height / 2 + 60;
  // scene.addChild(inputText);

  // let input = document.createElement('input');
  // input.setAttribute('type', 'text');
  // input.classList.add('input-name');
  // input.maxLength = 6;
  // document.body.appendChild(input);

  // const inputButton = Button(
  //   75,
  //   18,
  //   8,
  //   0,
  //   (app.renderer.height * 2) / 3,
  //   'POST',
  //   app.spriteScale,
  //   () => {
  //     //   const leaderBoard = display_leader_board(app);
  //     //   scene.changeScene(leaderBoard);

  //     let name = input.value.toUpperCase().trim();

  //     if (!name) {
  //       inputText.text = 'Enter a name';
  //       inputText.style.fill = '0xff0000';
  //     } else {
  //       inputText.text = 'Posting...';
  //       inputText.style.fill = '0xff0000';

  //       scene.removeChild(inputButton);

  //       post_leader_board(app.db, name, killCount)
  //         .then(() => {
  //           // remove input
  //           document.body.removeChild(input);

  //           const leaderBoard = display_leader_board(app);
  //           scene.changeScene(leaderBoard);
  //         })
  //         .catch((error) => {
  //           inputText.text = 'Error posting score. Please Try again.';
  //           console.log(error);
  //           scene.addChild(inputButton);
  //         });
  //     }
  //   }
  // );
  // scene.addChild(inputButton);
};

const ShowScore = (app, scene) => {
  const retryButton = Button(
    75,
    18,
    8,
    0,
    40 * app.spriteScale,
    'RETRY',
    app.spriteScale,
    () => {
      const game = Game(app);
      scene.changeScene(game);
    }
  );
  scene.addChild(retryButton);

  const mainMenuButton = Button(
    75,
    18,
    8,
    0,
    retryButton.y + retryButton.height + 8 * app.spriteScale,
    'MENU',
    app.spriteScale,
    () => {
      const mainMenu = MainMenu(app);
      scene.changeScene(mainMenu);
    }
  );
  scene.addChild(mainMenuButton);
};

export default GameOver;
