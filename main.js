import './style.css';
import * as Phaser from 'phaser';

import Player from './src/Player';
import Zombie from './src/Zombie';
import Bullet from './src/Bullet';

const dimensions = {
  width: 512,
  height: 512,
};

const config = {
  type: Phaser.AUTO,
  ...dimensions,
  parent: 'app',
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet('player', './Art/Player/PlayerGunShot.png', {
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.image('map', './Art/GameWindow/map.png');
  this.load.image('map-border', './Art/GameWindow/GameplayAreaBorder.png');

  this.load.image('bullet', './Art/Player/Bullet.png');

  this.load.image('zombie1', './Art/Zombies/ZombieDesign1.png');
}

function create() {
  this.add.image(dimensions.width / 2 + 1, dimensions.height / 2 + 17, 'map');
  this.add.image(dimensions.width / 2, dimensions.height / 2, 'map-border');

  const bulletGroup = this.physics.add.group({
    classType: Bullet,
    runChildUpdate: true,
  });

  const zombieGroup = this.physics.add.group({
    classType: Zombie,
    runChildUpdate: true,
  });

  const playerGroup = this.physics.add.group({
    classType: Player,
    runChildUpdate: true,
  });
  const player = playerGroup.get(bulletGroup, zombieGroup);

  zombieGroup.get(player);
}

function update() {}
