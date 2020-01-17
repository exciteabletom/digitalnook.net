import {g} from "./Global.js";
export default class HeartPowerUp extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "heart");
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.setCollideWorldBounds(true);
		this.spawnTick = g.gameTick;
		this.setScale(0.3);
		this.setVelocityY(Phaser.Math.Between(-200, 200));
		this.setVelocityX(-300);
	}
	update() {
		if (g.gameTick % 300 === 0) {
			const randX = Phaser.Math.Between(-500, 0);
			const randY = Phaser.Math.Between(-200, 200);
			this.setVelocityX(randX);
			this.setVelocityY(randY);
		}
		if (g.gameTick === this.spawnTick + 2000) {
			this.destroy();
			g.powerUpActive = false;
		}
	}

}