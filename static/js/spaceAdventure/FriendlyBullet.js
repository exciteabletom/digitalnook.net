import { g } from "./Global.js"
export default class FriendlyBullet extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "friendlyBullet").setOrigin(0);
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);

		this.scene = config.scene;

		this.setDepth(100);
		this.setInteractive();
		this.setScale(4.5);
		this.setVelocityX(g.bulletSpeed);

	}
	update() {
		if (this.body.x > this.scene.scale.width + this.body.width) {
			this.destroy();
		}
	}

}