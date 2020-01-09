import {g} from "./Global.js";
import FriendlyBullet from "./FriendlyBullet.js";
// ship spritesheet
export default class Ship extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "ship");
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		config.scene.anims.create({
			key: "fire",
			frames: config.scene.anims.generateFrameNumbers("ship"),
			frameRate: 3,
			repeat: -1
		});
		this.setScale(3);
		this.setCollideWorldBounds(true);
		this.setMaxVelocity(g.vel);
		this.firingSpeed = 20; // lower number means higher speed
		this.tintFill = true;
		this.body.onCollide = true;
		this.anims.play("fire");
    }
}

