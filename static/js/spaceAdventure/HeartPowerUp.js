import {g} from "./Global.js";
export default class HeartPowerUp extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "heart");
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);

		this.spawnTick = g.gameTick;

		this.setCollideWorldBounds(true);
		this.setScale(0.3);
		this.setVelocityY(Phaser.Math.Between(-200, 200));
		this.setVelocityX(-500);
	}
	update() {
		if (g.gameTick % 200 === 0) {
			const randX = Phaser.Math.Between(-500, -200);
			const randY = Phaser.Math.Between(-200, 200);
			this.setVelocityX(randX);
			this.setVelocityY(randY);
		}
		if (g.gameTick === this.spawnTick + 2000) { // destroy after 2000 frames (roughly 30 seconds)
			this.destroy();
			g.powerUpActive = false;
		}
	}

}