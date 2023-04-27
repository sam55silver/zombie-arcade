import Collectible from './Collectible';

class Coin extends Collectible {
  constructor(scene, pos) {
    super(scene, pos);
  }

  pickup() {
    this.scene.killCount.update();
  }
}

export default Coin;
