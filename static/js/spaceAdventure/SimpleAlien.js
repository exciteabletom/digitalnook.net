import { g } from "./Global.js";
import EnemyBullet from "./EnemyBullet.js";

export default class SimpleAlien extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "simpleAlien");
		this.config = config;
		this.firingSpeed = Phaser.Math.Between(65, 75);
		this.internalTick = this.firingSpeed - Phaser.Math.Between(0, 30);
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.setScale(0.8);
		this.setDepth(100); // bullets were going underneath aliens
		let velY = Phaser.Math.Between(200, 600);
		if (Math.random() < 0.5) {
			velY = velY * -1
		}
		this.setVelocityY(velY);
		this.setVelocityX(-400);
		this.setCollideWorldBounds(true);
		this.setBounce(1);

	}

	update() {
		const {config, body} = this;
		this.internalTick++;

		if (this.internalTick % this.firingSpeed === 0 && Math.random() < 0.70) {
			g.Main.sprites.enemyBullets.add(new EnemyBullet({
				scene: config.scene,
				x: body.x - body.halfWidth,
				y: body.y + body.halfHeight
			}));
		}
	}
}
