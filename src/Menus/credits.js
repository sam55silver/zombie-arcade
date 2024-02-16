import { Sprite, Text } from 'pixi.js';
import Scene from '../Scene';
import Game from '../Game/Game';
import Button from './button';
import MainMenu from './mainMenu';
import fonts from "../fonts.json"

const Credits = (app) => {
  const socials = document.getElementById('socials');
  socials.style.display = 'block';

  const credits = new Scene(app);
  credits.x = app.renderer.width / 2;

  const creditsBase = new Sprite(app.spriteSheet.textures['credits-base.png']);
  creditsBase.anchor.set(0.5);
  creditsBase.scale.set(app.spriteScale);
  creditsBase.y = app.renderer.height / 2;
  credits.addChild(creditsBase);

  const moreCreditsText = new Text("See GitHub for more credits!", {
    ...fonts.entryStyle,
    fontSize: 5 * app.spriteScale,
    fill: 0xffffff,
  })
  moreCreditsText.anchor.set(0.5)
  moreCreditsText.y = creditsBase.y + 68 * app.spriteScale
  credits.addChild(moreCreditsText)

  const mainMenuButton = Button(
    75,
    18,
    8,
    0,
    app.renderer.height / 2 + 86 * app.spriteScale,
    'MAIN',
    app.spriteScale,
    () => {
      const mainMenu = MainMenu(app, false);
      credits.changeScene(mainMenu);
    }
  );
  credits.addChild(mainMenuButton);

  return credits;
};

export default Credits;
