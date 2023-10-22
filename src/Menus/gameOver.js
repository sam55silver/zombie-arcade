import { Container, Graphics, Text } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import fonts from '../fonts.json';
import Button from './button';
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
  console.log("High Scores:", app.high_scores, "new score?", highScorePosition)

  if (highScorePosition) {
    NewHighScore(app, killCount, scene);
  } else {
    ShowScore(app, scene);
  }

  return scene;
};

const HighScorePosition = (high_scores, killCount) => {
  for (let i = 0; i < high_scores.length; i++) {
    if (high_scores[i].score == "N/A" || killCount > high_scores[i].score) {
      return true;
    }
  }

  return false;
};

const NewHighScore = (app, killCount, scene) => {
  scene.y = scene.y - 30 * app.spriteScale;

  const highScoreText = new Text('New High Score!', {
    ...fonts.entryStyle,
    'fill': '0xffffff',
  });
  highScoreText.anchor.set(0.5);
  highScoreText.y = 30 * app.spriteScale;
  scene.addChild(highScoreText);

  // Input
  const input = new Container();
  input.y = 60 * app.spriteScale;
  scene.addChild(input);

  const width = 150 * app.spriteScale;
  const height = 20 * app.spriteScale;
  const radius = 5 * app.spriteScale;

  const inputArea = new Graphics();
  inputArea.beginFill(0xffffff);
  inputArea.drawRoundedRect(-width / 2, -height / 2, width, height, radius);
  inputArea.endFill();
  input.addChild(inputArea);

  const inputTextProps = (color) => ({
    ...fonts.entryStyle,
    fontSize: 10 * app.spriteScale,
    fill: color,
  });

  let defaultInputText = new Text('ENTER NAME', inputTextProps('0x616161'));
  defaultInputText.anchor.set(0.5);
  input.addChild(defaultInputText);

  let inputText = new Text('', inputTextProps('0xff0000'));
  inputText.anchor.set(0.5);
  input.addChild(inputText);

  input.eventMode = 'dynamic';
  let cursorOut = true;

  // Change cursor on hover and leave
  input.on('pointerover', () => {
    document.body.style.cursor = 'text';
    cursorOut = false;
  });
  input.on('pointerout', () => {
    document.body.style.cursor = 'default';
    cursorOut = true;
  });

  let inputMode = false;

  const captureInput = (e) => {
    if (inputMode) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (e.key === 'Enter') {
      console.log('Enter');
      removeCaptureInput();
    }

    if (e.key === 'Backspace') {
      inputText.text = inputText.text.slice(0, -1);
    }

    const nameMaxLength = 8;

    if (e.key.length === 1 && inputText.text.length < nameMaxLength) {
      inputText.text += e.key.toUpperCase();
    }
  };

  const removeCaptureInput = () => {
    document.removeEventListener('keydown', captureInput);
    inputMode = false;

    if (inputText.text.length == 0) {
      input.addChild(defaultInputText);
    } else {
      inputText.text = inputText.text.trim();
    }
  };

  input.on('click', () => {
    inputMode = true;
    input.removeChild(defaultInputText);
    document.addEventListener('keydown', captureInput);
  });

  // Clicking outside of input area will remove focus
  document.addEventListener('click', (e) => {
    if (cursorOut && inputMode) {
      removeCaptureInput();
    }
  });

  let posting = false;

  const postButton = Button(
    75,
    18,
    8,
    0,
    95 * app.spriteScale,
    'POST',
    app.spriteScale,
    () => {
      if (posting) return;
      removeCaptureInput();

      const name = inputText.text;

      if (name.length > 0) {
        posting = true;
        highScoreText.text = 'Posting...';
        highScoreText.style.fill = '0xc7383c';

        post_leader_board(name, killCount)
          .then(() => {
            const mainMenu = MainMenu(app);
            scene.changeScene(mainMenu);
          })
          .catch((error) => {
            posting = false;
            highScoreText.text = 'Error posting score. Please Try again.';
            console.log(error);
          });
      } else {
        highScoreText.text = 'Enter a name!';
        highScoreText.style.fill = '0xc7383c';
      }
    }
  );
  scene.addChild(postButton);
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
