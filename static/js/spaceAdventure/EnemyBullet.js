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
	}
	update() {
		if (this.body.x < this.body.width * -1) {
			this.destroy();
		}
	}
}
