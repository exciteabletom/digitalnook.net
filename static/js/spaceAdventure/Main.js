"use strict";
import Bullet from "./Bullet.js";

let keyW, keyS, keyA, keyD;
export default class Main extends Phaser.Scene {
	constructor() {
		super("main");
		this.sprites = {};
		this.vel = 300; // velocity variable so that speed can be changed more easily
		// bullet vars
		this.firingSpeed = 30; // lower number means higher speed
		this.firingCounter = 0;
		this.bulletSpeed = 500;

	}

	preload() {
		this.load.image("ship", "/static/images/spaceAdventure/spaceship.png");
		this.load.image("bullet", "/static/images/spaceAdventure/bullet.png");
		this.load.audio("backgroundAudio", "/static/audio/spaceAdventure/space.ogg");
	}

	create() {
		const {sprites} = this;

		const bgAudio = this.sound.add("backgroundAudio");
		bgAudio.play({loop: true,});

		keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

		sprites.ship = this.physics.add.sprite(150, 225, "ship").setScale(0.09);
		sprites.ship.setInteractive();
		sprites.ship.setCollideWorldBounds();
	}

	update() {
		//const {sprites} = this;
		this.checkCursors();
		this.checkGun();

	}

	checkGun() {
		this.firingCounter++;
		if (this.firingCounter === this.firingSpeed){
			this.firingCounter = 0;
			this.fireGun();
		}
	}

	fireGun() {
		const shipX = this.sprites.ship.body.x;
		const shipY = this.sprites.ship.body.y;

		const bullet = new Bullet({scene: this, x: shipX + 100, y: shipY +30});
		bullet.setVelocityX(this.bulletSpeed);
	}

	checkCursors() {

		this.sprites.ship.setVelocityX(0);
		this.sprites.ship.setVelocityY(0);

		if (keyW.isDown){
			this.sprites.ship.setVelocityY(this.vel * -1);
		} if (keyS.isDown) {
			this.sprites.ship.setVelocityY(this.vel);
		} if (keyA.isDown) {
			this.sprites.ship.setVelocityX(this.vel * -1);
		} if (keyD.isDown) {
			this.sprites.ship.setVelocityX(this.vel)
		}

	}

}