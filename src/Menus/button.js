import { Container, Graphics, Text } from 'pixi.js';
import fonts from '../fonts.json';

const Button = (width, height, radius, x, y, text, spriteScale, onClick) => {
  const button = new Container();
  button.eventMode = 'dynamic';
  button.y = y;
  button.x = x;

  const buttonProps = {
    width: width * spriteScale,
    height: height * spriteScale,
    radius: radius * spriteScale,
  };

  const shadowSize = 2 * spriteScale;

  const buttonRectShadow = new Graphics();
  buttonRectShadow.beginFill(0xff0000);
  buttonRectShadow.drawRoundedRect(
    -buttonProps.width / 2,
    -buttonProps.height / 2 + shadowSize,
    buttonProps.width,
    buttonProps.height,
    buttonProps.radius
  );
  buttonRectShadow.endFill();
  button.addChild(buttonRectShadow);

  const buttonRect = new Graphics();
  buttonRect.beginFill(0xffffff);
  buttonRect.drawRoundedRect(
    -buttonProps.width / 2,
    -buttonProps.height / 2,
    buttonProps.width,
    buttonProps.height,
    buttonProps.radius
  );
  buttonRect.endFill();
  button.addChild(buttonRect);

  const buttonText = new Text(text, {
    ...fonts.entryStyle,
    fontSize: 8 * spriteScale,
    fill: 0xff0000,
  });
  buttonText.anchor.set(0.5);
  button.addChild(buttonText);

  button.on('click', () => {
    onClick();
  });

  return button;
};

export default Button;
