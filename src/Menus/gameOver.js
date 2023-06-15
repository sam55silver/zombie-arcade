import { Container, Text } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import fonts from '../fonts.json';
import Button from './button';
import display_leader_board from './mainMenu';
import post_leader_board from '../LeaderBoard/postLeaderBoard';

const GameOver = (app, killCount) => {
  const scene = new Scene(app);
  scene.x = app.renderer.width / 2;

  const headerText = new Text('Game Over', {
    ...fonts.headerStyle,
    'fontSize': 30,
    'fill': '0xc7383c',
  });
  headerText.anchor.set(0.5);
  headerText.y = app.renderer.height / 3 - 50;

  scene.addChild(headerText);

  const score = new Text(killCount, {
    ...fonts.headerStyle,
    'fontSize': 40,
    'fill': '0xc7383c',
  });

  score.anchor.set(0.5);
  score.y = headerText.y + 50;

  scene.addChild(score);

  const highScorePosition = HighScorePosition(app.high_scores, killCount);

  if (highScorePosition) {
    scene.addChild(NewHighScore(app, killCount, highScorePosition, scene));
  } else {
    scene.addChild(ShowScore(app, scene));
  }

  //   scene.loadScene();
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
  const container = new Container();

  const whiteEntryStyle = {
    ...fonts.entryStyle,
    'fill': '0xffffff',
  };

  const highScoreText = new Text('New High Score!', whiteEntryStyle);
  highScoreText.anchor.set(0.5);
  highScoreText.y = app.renderer.height / 2 - 60;
  container.addChild(highScoreText);

  const inputText = new Text(
    `Enter a name to insert into ${highScorePosition}/9`,
    whiteEntryStyle
  );
  inputText.anchor.set(0.5);
  inputText.y = app.renderer.height / 2 + 60;
  container.addChild(inputText);

  let input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add('input-name');
  input.maxLength = 6;
  document.body.appendChild(input);

  const inputButton = Button(
    app.spriteSheet.textures['buttons/credits-0.png'],
    0,
    (app.renderer.height * 2) / 3 + 20,
    app.spriteScale,
    () => {
      //   const leaderBoard = display_leader_board(app);
      //   scene.changeScene(leaderBoard);

      let name = input.value.toUpperCase().trim();

      if (!name) {
        inputText.text = 'Enter a name';
        inputText.style.fill = '0xff0000';
      } else {
        inputText.text = 'Posting...';
        inputText.style.fill = '0xff0000';

        container.removeChild(inputButton);

        post_leader_board(app.db, name, killCount)
          .then(() => {
            // remove input
            document.body.removeChild(input);

            const leaderBoard = display_leader_board(app);
            scene.changeScene(leaderBoard);
          })
          .catch((error) => {
            inputText.text = 'Error posting score. Please Try again.';
            console.log(error);
            container.addChild(inputButton);
          });
      }
    }
  );
  container.addChild(inputButton);

  return container;
};

const ShowScore = (app, scene) => {
  const container = new Container();

  const retryButton = Button(
    app.spriteSheet.textures['buttons/retry-0.png'],
    0,
    app.renderer.height / 2,
    app.spriteScale,
    () => {
      // Start game
      const game = Game(app);
      scene.changeScene(game);
    }
  );
  container.addChild(retryButton);

  const menuButton = Button(
    app.spriteSheet.textures['buttons/death-screen-menu-0.png'],
    0,
    app.renderer.height / 2 + 100,
    app.spriteScale,
    () => {
      const leaderBoard = display_leader_board(app);
      scene.changeScene(leaderBoard);
    }
  );
  container.addChild(menuButton);

  return container;
};

export default GameOver;
