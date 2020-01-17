import { g } from "./Global.js"
export default class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "enemyBullet").setAngle(180);

		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);

		const eBullets = config.scene.sprites.enemyBullets.getChildren();
		const max = config.scene.sprites.enemyBullets.maxSize -5;

		if (eBullets.length > max) {
			for (let i = eBullets.length - 1; i > max; i--) {
				const curr = eBullets[i];
				curr.destroy();
			}
		}
		this.setDepth(100);
		this.setInteractive();
		this.setScale(4);
		this.setVelocityX(-500);

		this.setCollideWorldBounds(true);
		this.body.onWorldBounds = true;

		config.scene.physics.world.on("worldbounds", (body) => {
			if (body.gameObject === this) {
				this.destroy();
			}
		}, this);
	}
}