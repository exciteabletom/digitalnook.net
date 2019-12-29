export default class Bullet extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "bullet");
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);

		this.setInteractive();
		this.setScale(0.05);

		this.body.onWorldBounds = true;

		this.body.world.on("worldbounds", body => {
			if (body.gameObject === this) {
				//this.setActive(false);
				//this.setVisible(false);
				this.kill();
			}
		}, this);
	}

}