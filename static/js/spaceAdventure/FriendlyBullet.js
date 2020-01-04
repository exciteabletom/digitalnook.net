import { g } from "./Global.js"
export default class FriendlyBullet extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "friendlyBullet").setOrigin(0);
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		const fBullets = config.scene.sprites.friendlyBullets.getChildren();
		const max = config.scene.sprites.enemyBullets.maxSize -5;

		if (fBullets.length > max) {
			for (let i = fBullets.length -1; i > max; i--){
				const curr = fBullets[i];
				curr.destroy();
			}
		}

		this.setDepth(100);
		this.setInteractive();
		this.setScale(4);
		this.setVelocityX(g.bulletSpeed);

		this.setCollideWorldBounds(true);
		this.body.onWorldBounds = true;

		config.scene.physics.world.on("worldbounds", (body) => {
			if (body.gameObject === this) {
				this.destroy();
			}
		}, this);

	}

}