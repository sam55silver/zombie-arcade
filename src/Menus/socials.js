import { Container, Graphics, Text, Sprite } from 'pixi.js';
import fonts from '../fonts.json';

const Socials = (spriteScale) => {
  const socials = new Container();

  const scale = 0.1 * spriteScale;
  const textureX = 17 * spriteScale;
  
  const githubTexture = Sprite.from("https://assets.samsilver.ca/zombie-arcade/socials/github.png");
  githubTexture.x = -textureX;
  githubTexture.anchor.set(0.5);
  githubTexture.scale.set(scale);
  githubTexture.eventMode = 'dynamic';
  socials.addChild(githubTexture);

  githubTexture.on('pointerdown', () => {
    window.open("https://github.com/sam55silver/zombie-arcade")
  });

  const xTexture = Sprite.from("https://assets.samsilver.ca/zombie-arcade/socials/x.png");
  xTexture.x = textureX
  xTexture.anchor.set(0.5);
  xTexture.scale.set(scale);
  xTexture.eventMode = 'dynamic';
  socials.addChild(xTexture);

  xTexture.on('pointerdown', () => {
    window.open("https://twitter.com/sam55silver")
  });

  return socials;
};

export default Socials;
