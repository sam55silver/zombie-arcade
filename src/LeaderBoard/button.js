import { Sprite } from 'pixi.js';

const Button = (sprite, x, y, spriteScale, onClick) => {
  const button = new Sprite(sprite);
  button.anchor.set(0.5);
  button.scale.set(spriteScale);
  button.x = x;
  button.y = y;
  button.eventMode = 'dynamic';

  // change cursor to pointer
  // button.addEventListener('mouseover', () => {
  //   document.body.style.cursor = 'pointer';
  // });

  // button.addEventListener('mouseout', () => {
  //   document.body.style.cursor = 'default';
  // });

  button.addEventListener('pointertap', onClick);

  return button;
};

export default Button;
