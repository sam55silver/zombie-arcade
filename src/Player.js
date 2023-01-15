const Player = new Phaser.Class({
  Extends: Phaser.Physics.Arcade.Sprite,

  initialize:
    // Zombie Constructor
    function Player(scene, bulletGroup, zombieGroup) {
      Phaser.Physics.Arcade.Sprite.call(this, scene, 300, 300, 'player');
      this.setOrigin(0.5, 0.8);

      this.speed = 0.2;

      this.cursors = scene.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D,
      });

      this.scene.input.on(
        'pointerdown',
        function (pointer, time, lastFired) {
          if (this.active === false) return;

          if (this.anims.isPlaying) return;

          // Get bullet from bullets group
          var bullet = bulletGroup.get().setActive(true).setVisible(true);

          if (bullet) {
            this.play('shoot');
            bullet.fire(this, scene.input.mousePointer);
            scene.physics.add.overlap(
              zombieGroup,
              bullet,
              this.enemyHitCallback
            );
          }
        },
        this
      );

      this.anims.create({
        key: 'shoot',
        frames: this.anims.generateFrameNumbers('player', {
          frames: [0, 1, 2, 3, 4],
        }),
        frameRate: 8,
        repeat: 0,
      });

      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', {
          frames: [4],
        }),
        frameRate: 1,
      });

      this.play('idle');
      this.anims.isPlaying = false;
    },

  enemyHitCallback: function (group, zombie) {
    zombie.hit(1);
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
    this.setVelocity(0);

    this.rotation =
      Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.scene.input.mousePointer.x,
        this.scene.input.mousePointer.y
      ) + Phaser.Math.DegToRad(90);

    let dir = [0, 0];
    if (this.cursors.left.isDown) {
      dir[0] = -1;
    } else if (this.cursors.right.isDown) {
      dir[0] = 1;
    }

    if (this.cursors.up.isDown) {
      dir[1] = -1;
    } else if (this.cursors.down.isDown) {
      dir[1] = 1;
    }

    if (dir[0] !== 0 || dir[1] !== 0) {
      const vec2 = new Phaser.Math.Vector2(dir[0], dir[1]);
      const velocity = vec2.normalize().scale(this.speed);
      this.x += velocity.x * delta;
      this.y += velocity.y * delta;
    }
  },
});

export default Player;
