export default class BossAlien extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "bossAlien");
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);

		this.setInteractive();
		this.setScale(0.5);
		this.setCollideWorldBounds(true);
		this.body.onWorldBounds = true;


	}
}
