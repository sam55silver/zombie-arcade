import Zombie from './Zombie';

const ZombieSpawner = (app, map) => {
  // Calculate map dimensions
  const mapDimensions = {
    width: map.texture.baseTexture.resource.source.width,
    height: map.texture.baseTexture.resource.source.height,
    x: map.x,
    y: map.y,
  };

  // Calculate map borders i.e. the area where zombies can spawn
  const mapArea = {
    topLeft: {
      x: mapDimensions.x - mapDimensions.width / 2,
      y: mapDimensions.y - mapDimensions.height / 2,
    },
    bottomRight: {
      x: mapDimensions.x + mapDimensions.width / 2,
      y: mapDimensions.y + mapDimensions.height / 2,
    },
    topRight: {
      x: mapDimensions.x + mapDimensions.width / 2,
      y: mapDimensions.y - mapDimensions.height / 2,
    },
    bottomLeft: {
      x: mapDimensions.x - mapDimensions.width / 2,
      y: mapDimensions.y + mapDimensions.height / 2,
    },
  };

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
        return spawnZombieInArea(mapArea.topLeft, mapArea.topRight, 'y', -1);
      case 1:
        // spawn on right
        return spawnZombieInArea(mapArea.topRight, mapArea.bottomRight, 'x', 1);
      case 2:
        // spawn on bottom
        return spawnZombieInArea(
          mapArea.bottomLeft,
          mapArea.bottomRight,
          'y',
          1
        );
      case 3:
        // spawn on left
        return spawnZombieInArea(mapArea.topLeft, mapArea.bottomLeft, 'x', -1);
    }
  };

  // create zombie list to add to and keep track of in app
  app.zombies = [];

  const spawnZombie = () => {
    // chose area to spawn zombie
    const zombie = new Zombie(app, 1, chooseSpawnArea());
    app.zombies.push(zombie);
    app.gameArea.addChild(zombie);

    // Start timer to Spawn the next zombie
    const baseTime = 1000;
    const flexTime = Math.random() * 1000; // Add small variation to spawn time
    setTimeout(spawnZombie, baseTime + flexTime);
  };

  // Start zombie spawner
  setTimeout(spawnZombie, 1000);
};

export default ZombieSpawner;
