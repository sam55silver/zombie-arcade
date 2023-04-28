import Collectible from './Collectible';

class Coin extends Collectible {
  constructor(scene, pos) {
    super(scene, pos, scene.spriteSheet.textures['kill-ui.png']);
  }

  pickup() {
    this.scene.killCount.update();
  }
}

export default Coin;
