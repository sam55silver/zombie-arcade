const Zombie = new Phaser.Class({
  Extends: Phaser.Physics.Arcade.Sprite,

  initialize:
    // Zombie Constructor
    function Zombie(scene, player) {
      Phaser.Physics.Arcade.Sprite.call(this, scene, 200, 200, 'zombie1');
      this.health = 2;
      this.canBeHit = true;
      this.speed = 0.05;
      this.player = player;
      // this.scene.physics.add.collider(this, player);
    },

  hit: function (damage) {
    if (!this.canBeHit) return;

    this.health -= damage;

    if (this.health <= 0) {
      this.destroy();
    } else {
      this.canBeHit = false;
      setTimeout(() => (this.canBeHit = true), 100);
    }
  },

  update: function (time, delta) {
    this.rotation =
      Phaser.Math.Angle.Between(this.player.x, this.player.y, this.x, this.y) +
      Phaser.Math.DegToRad(-90);

    const zombieVec2 = new Phaser.Math.Vector2(this.x, this.y);
    const playerVec2 = new Phaser.Math.Vector2(this.player.x, this.player.y);
    const diffVec2 = playerVec2.subtract(zombieVec2);

    if (diffVec2.length() > 10) {
      const velocity = diffVec2.normalize().scale(this.speed);
      this.x += velocity.x * delta;
      this.y += velocity.y * delta;
    }
  },
});

export default Zombie;
