import { Container, Graphics, Text } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import fonts from '../fonts.json';
import Button from './button';
import post_leader_board from '../LeaderBoard/postLeaderBoard';
import MainMenu from './mainMenu';

const GameOver = (app, killCount) => {
  if (app.isMobile) {
    app.renderer.resize(
      app.renderer.width,
      app.renderer.height - 125 * app.spriteScale
    );
  }

  const scene = new Scene(app);
  scene.x = app.renderer.width / 2;
  scene.y = app.renderer.height / 2;

  const socials = document.getElementById('socials');
  socials.style.display = 'block';

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

  if (highScorePosition == -1) {
    ShowScore(app, scene);
  } else {
    NewHighScore(app, killCount, highScorePosition, scene);
  }

  return scene;
};

const HighScorePosition = (high_scores, killCount) => {
  for (let i = 0; i < high_scores.length; i++) {
    if (high_scores[i].score == "N/A" || killCount > high_scores[i].score) {
      return i;
    }
  }

  return -1;
};

const NewHighScore = (app, killCount, highScorePosition, scene) => {
  scene.y = scene.y - 30 * app.spriteScale;

  const highScoreText = new Text('New High Score!', {
    ...fonts.entryStyle,
    'fontSize': 10 * app.spriteScale,
    'fill': '0xffffff',
  });
  highScoreText.anchor.set(0.5);
  highScoreText.y = 30 * app.spriteScale;
  scene.addChild(highScoreText);

  // Input
  const input = new Container();
  const inputY = 18 * app.spriteScale;
  //scene.addChild(input);

  const width = 120 * app.spriteScale;
  const height = 15 * app.spriteScale;
  const fontSize = 12 * app.spriteScale;
  const radius = 5 * app.spriteScale;

  const inputElem = document.createElement("input")
  inputElem.classList.add("input-name")
  inputElem.maxLength = "6"

  const canvas = app.view.getBoundingClientRect();

  inputElem.style.top = canvas.top + (app.view.height / 2) + inputY + 'px';
  inputElem.style.width = width + 'px'
  inputElem.style.height = height + 'px'
  inputElem.style.fontSize = fontSize + 'px'
  inputElem.style.borderRadius = radius + 'px'

  const appContainer = document.getElementById("container")
  appContainer.appendChild(inputElem)

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

      const name = inputElem.value.toUpperCase();

      if (name.length > 0) {
        posting = true;
        highScoreText.text = 'Posting...';
        highScoreText.style.fill = '0xc7383c';

        post_leader_board(name, killCount)
          .then(() => {
            app.musicFadeIn()

            app.high_scores.splice(highScorePosition, 0, {name: name, score: killCount})

            appContainer.removeChild(inputElem)

            const mainMenu = MainMenu(app);
            scene.changeScene(mainMenu);
          })
          .catch((error) => {
            posting = false;
            highScoreText.text = 'Error posting score.\nPlease Try again.';
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
      app.musicFadeIn()
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
      app.musicFadeIn()
      const mainMenu = MainMenu(app);
      scene.changeScene(mainMenu);
    }
  );
  scene.addChild(mainMenuButton);
};

export default GameOver;
