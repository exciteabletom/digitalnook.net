import { g } from "./Global.js";
import EnemyBullet from "./EnemyBullet.js";

export default class SimpleAlien extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "simpleAlien");
		this.config = config;

		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.setScale(0.8);
		this.setDepth(100); // bullets were going underneath aliens, i needed to make sure that the aliens were on top
		let velY = Phaser.Math.Between(100, 500);
		if (Math.random() < 0.5) {
			velY = velY * -1
		}
		this.setVelocityY(velY);
		this.setVelocityX(-400);
		this.body.onWorldBounds = true;
		this.setCollideWorldBounds(true);
		this.setBounce(1);

		config.scene.events.on("worldbounds", (body) => {
			console.log("BRUH");
			if (this.physics.body.touching=== true && body === this.body) {
				this.destroy();
			}
		}, this)
	}

	update() {
		const {config, body} = this;
		if (g.gameTick % 90 === 0 && Math.random() < 0.80) {
			g.Main.sprites.enemyBullets.add(new EnemyBullet({
				scene: config.scene,
				x: body.x - body.halfWidth,
				y: body.y + body.halfHeight
			}));
		}
	}
}
