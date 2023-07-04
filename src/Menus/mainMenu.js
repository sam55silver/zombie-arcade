import { Container, Text, Sprite } from 'pixi.js';
import Game from '../Game/Game';
import Scene from '../Scene';
import fonts from '../fonts.json';
import Button from './button';
import get_leader_board from '../LeaderBoard/getLeaderBoard';
import Credits from './credits';

const MainMenu = (app, fetchLeaderBoard = true) => {
  const mainMenu = new Scene(app);
  mainMenu.x = app.renderer.width / 2;

  if (fetchLeaderBoard) {
    get_leader_board(app.db)
      .then((scores) => {
        app.high_scores = scores;
        MenuDisplay(app, mainMenu);
      })
      .catch((error) => {
        console.log(error);

        mainMenu.y = app.renderer.height / 2;

        const errorText = new Text(
          'Error loading leader board',
          fonts.headerStyle
        );
        errorText.anchor.set(0.5);
        mainMenu.addChild(errorText);
      });
  } else {
    MenuDisplay(app, mainMenu);
  }

  return mainMenu;
};

const MenuDisplay = (app, scene) => {
  const title = new Sprite(app.spriteSheet.textures['title.png']);
  title.anchor.set(0.5);
  title.scale.set(app.spriteScale);
  title.y = app.renderer.height / 2 - 90 * app.spriteScale;
  scene.addChild(title);

  let scoresContainer = new Container();
  // scoresContainer.y = title.y + (2 * title.height) / 3;
  scene.addChild(scoresContainer);

  const header = new Container();
  scoresContainer.addChild(header);

  const horizontal_spacing = 70 * app.spriteScale;
  const vertical_spacing = 12 * app.spriteScale;
  const font_size = 8 * app.spriteScale;

  const rankText = new Text('Rank', {
    ...fonts.entryStyle,
    fontSize: font_size,
    fill: 0xffffff,
  });
  rankText.x = -horizontal_spacing;
  header.addChild(rankText);

  const nameText = new Text('Name', {
    ...fonts.entryStyle,
    fontSize: font_size,
    align: 'center',
    fill: 0xffffff,
  });
  nameText.anchor.set(0.5, 0);
  header.addChild(nameText);

  const scoreText = new Text('Score', {
    ...fonts.entryStyle,
    fontSize: font_size,
    align: 'right',
    fill: 0xffffff,
  });
  scoreText.anchor.set(1, 0);
  scoreText.x = horizontal_spacing;
  header.addChild(scoreText);

  app.high_scores.forEach((entry, index) => {
    let entryContainer = new Container();

    let rankPrefix = 'TH';
    if (index === 0) {
      rankPrefix = 'ST';
    } else if (index === 1) {
      rankPrefix = 'ND';
    } else if (index === 2) {
      rankPrefix = 'RD';
    }

    let numText = new Text(`${index + 1}${rankPrefix}`, {
      ...fonts.entryStyle,
      fontSize: font_size,
    });
    numText.x = -horizontal_spacing;

    let nameText = new Text(`${entry.name}`, {
      ...fonts.entryStyle,
      fontSize: font_size,
      align: 'center',
    });
    nameText.anchor.set(0.5, 0);

    let scoreText = new Text(`${entry.score}`, {
      ...fonts.entryStyle,
      fontSize: font_size,
    });
    scoreText.anchor.set(1, 0);
    scoreText.x = horizontal_spacing;

    entryContainer.addChild(numText);
    entryContainer.addChild(nameText);
    entryContainer.addChild(scoreText);

    entryContainer.y = (index + 1) * vertical_spacing;

    scoresContainer.addChild(entryContainer);
  });

  scoresContainer.y = app.renderer.height / 2 - scoresContainer.height / 2;
  scoresContainer.y = scoresContainer.y - 4 * app.spriteScale;

  const playButton = Button(
    75,
    18,
    8,
    0,
    app.renderer.height / 2 + scoresContainer.height / 2 + 15 * app.spriteScale,
    'PLAY',
    app.spriteScale,
    () => {
      const game = Game(app);
      scene.changeScene(game);
    }
  );
  scene.addChild(playButton);

  const creditsButton = Button(
    75,
    18,
    8,
    0,
    app.renderer.height / 2 + scoresContainer.height / 2 + 40 * app.spriteScale,
    'CREDITS',
    app.spriteScale,
    () => {
      const credits = Credits(app);
      scene.changeScene(credits);
    }
  );
  scene.addChild(creditsButton);

  return scene;
};

export default MainMenu;
