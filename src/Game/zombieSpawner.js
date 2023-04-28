import Zombie from './Zombie';

class Spawner {
  constructor(scene) {
    this.time = Date.now();
    this.scene = scene;

    this.spawnZombie();
    this.setTimer();
  }

  spawnZombieInArea = (p1, p2, offsetDir, offsetSign) => {
    // Get random point in area
    const x = Math.floor(Math.random() * (p2.x - p1.x + 1)) + p1.x;
    const y = Math.floor(Math.random() * (p2.y - p1.y + 1)) + p1.y;
    let point = { x, y };

    // add offset to point
    const offset = 35;
    point[offsetDir] = point[offsetDir] + offsetSign * offset;

    return point;
  };

  // Choose where to spawn zombie on the map, top, right, bottom or left
  chooseSpawnArea = () => {
    // Random choose between top: 0, right: 1, bottom: 2, left: 3
    const spawnArea = Math.floor(Math.random() * 4);

    switch (spawnArea) {
      case 0:
        // spawn on top
        return this.spawnZombieInArea(
          this.scene.map.area.topLeft,
          this.scene.map.area.topRight,
          'y',
          -1
        );
      case 1:
        // spawn on right
        return this.spawnZombieInArea(
          this.scene.map.area.topRight,
          this.scene.map.area.bottomRight,
          'x',
          1
        );
      case 2:
        // spawn on bottom
        return this.spawnZombieInArea(
          this.scene.map.area.bottomLeft,
          this.scene.map.area.bottomRight,
          'y',
          1
        );
      case 3:
        // spawn on left
        return this.spawnZombieInArea(
          this.scene.map.area.topLeft,
          this.scene.map.area.bottomLeft,
          'x',
          -1
        );
    }
  };

  spawnZombie = () => {
    // Get random int between 0 and 1
    const type = Math.floor(Math.random() * 2);

    // chose area to spawn zombie
    const zombie = new Zombie(this.scene, type, this.chooseSpawnArea());
    this.scene.zombies.push(zombie);
    this.scene.gameArea.addChild(zombie);
  };

  getSpawnTime() {
    const time = (Date.now() - this.time) / 1000;
    const spawnTime = (3 - (1 / 1000) * Math.pow(time, 2)) * 1000;

    if (spawnTime < 1000) {
      return 1000;
    }

    return spawnTime;
  }

  setTimer() {
    // Start timer to spawn next zombie
    setTimeout(() => {
      // Stop spawning zombies if game is over
      if (this.scene.gameOver) {
        return;
      }

      this.spawnZombie();
      this.setTimer();
    }, this.getSpawnTime());
  }
}

export default Spawner;
