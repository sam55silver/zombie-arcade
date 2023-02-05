import Zombie from './Zombie';

const ZombieSpawner = (app) => {
  // Function to get a random point in a given vector
  // Add offset to the point to spawn zombies outside the map
  const spawnZombieInArea = (p1, p2, offsetDir, offsetSign) => {
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
  const chooseSpawnArea = () => {
    // Random choose between top: 0, right: 1, bottom: 2, left: 3
    const spawnArea = Math.floor(Math.random() * 4);

    switch (spawnArea) {
      case 0:
        // spawn on top
        return spawnZombieInArea(
          app.map.area.topLeft,
          app.map.area.topRight,
          'y',
          -1
        );
      case 1:
        // spawn on right
        return spawnZombieInArea(
          app.map.area.topRight,
          app.map.area.bottomRight,
          'x',
          1
        );
      case 2:
        // spawn on bottom
        return spawnZombieInArea(
          app.map.area.bottomLeft,
          app.map.area.bottomRight,
          'y',
          1
        );
      case 3:
        // spawn on left
        return spawnZombieInArea(
          app.map.area.topLeft,
          app.map.area.bottomLeft,
          'x',
          -1
        );
    }
  };

  // create zombie list to add to and keep track of in app
  app.zombies = [];

  const spawnZombie = () => {
    // Get random int between 0 and 1
    const type = Math.floor(Math.random() * 2);

    // chose area to spawn zombie
    const zombie = new Zombie(app, type, chooseSpawnArea());
    app.zombies.push(zombie);
    app.gameArea.addChild(zombie);
  };

  const singleZombieButton = document.getElementById('spawn-zombie');
  singleZombieButton.addEventListener('click', () => {
    spawnZombie();
  });

  const spawnerButton = document.getElementById('spawner');
  let spawnerOn = spawnerButton.checked;

  spawnerButton.addEventListener('click', (e) => {
    spawnerOn = e.target.checked;

    if (spawnerOn) {
      zombieSpawnTimer();
    }
  });

  const zombieSpawnTimer = () => {
    // Start timer to Spawn the next zombie
    const baseTime = 1000;
    const flexTime = Math.random() * 1000; // Add small variation to spawn time
    setTimeout(() => {
      if (!spawnerOn) return;
      spawnZombie();
      zombieSpawnTimer();
    }, baseTime + flexTime);
  };

  if (spawnerOn) {
    zombieSpawnTimer();
  }
};

export default ZombieSpawner;
