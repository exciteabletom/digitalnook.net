"use strict";
import FriendlyBullet from "./FriendlyBullet.js";
import Background from "./Background.js";
import { g , getRandomInt } from "./Global.js";
import SimpleAlien from "./SimpleAlien.js";
import {HudText, PlusHudText} from "./HudText.js";

let keyW, keyS, keyA, keyD, keyF, keySpace;
export default class Main extends Phaser.Scene {
	constructor() {
		super("main");
		this.sprites = {};
		this.hud = {}; // Heads Up Display Elements
		this.vel = 750; // velocity variable so that speed can be changed more easily
		// bullet vars
		this.firingSpeed = 28; // lower number means higher speed
		this.firingCooldown = 0;
		this.alienSpawnRate = 100; // lower is quicker
	}

	preload() {
		//	this.load.image("ship", "/static/images/spaceAdventure/sheet.png");
		this.load.spritesheet("ship",
			"/static/images/spaceAdventure/sheet/shipSheet.png",
			{frameWidth: 52, frameHeight: 30,}
		);
		this.load.image("heart", "/static/images/spaceAdventure/heart.png");
		this.load.image("friendlyBullet", "/static/images/spaceAdventure/friendlyBullet.png");
		this.load.image("enemyBullet", "/static/images/spaceAdventure/enemyBullet.png");
		this.load.image("simpleAlien", "/static/images/spaceAdventure/simpleAlien.png");
		this.load.image("background", "/static/images/spaceAdventure/background.jpg");
		this.load.audio("backgroundAudio", "/static/audio/spaceAdventure/space.ogg");
		this.load.audio("explosionAudio", "/static/audio/spaceAdventure/explosion1.wav");
		this.load.audio("invincible", "/static/audio/spaceAdventure/invincible.ogg");
	}

	create() {
		g.Main = this;
		const {sprites} = this;
		this.bgAudio = this.sound.add("backgroundAudio", {rate: 1, detune: 200, volume : "0.4"});
		this.bgAudio.play({loop: true,});
		this.background = new Background({
			scene: this,
			x: 0,
			y: 0,
			width: 1900,
			height: 600,
			key: "background"
		}).setZ(-1); // make background always underneath everything

		// ship spritesheet
		this.anims.create({
			key: "fire",
			frames: this.anims.generateFrameNumbers("ship"),
			frameRate: 3,
			repeat: -1
		});
		sprites.ship = this.physics.add.sprite(150, 225, "ship").setScale(3);
		sprites.ship.setInteractive();
		sprites.ship.setCollideWorldBounds();
		sprites.ship.setMaxVelocity(this.vel);
		sprites.ship.body.onCollide = true;
		sprites.ship.anims.play("fire"); // flaming booster anim
		// end ship spritesheet


		keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
		keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


		//stores sprite groups
		sprites.aliens = this.add.group({
			classType: Phaser.Physics.Arcade.Sprite,
			runChildUpdate: true,
		});
		sprites.friendlyBullets = this.add.group({
			classType: Phaser.Physics.Arcade.Sprite,
			maxSize: 30,
		});
		sprites.enemyBullets = this.add.group({
			classType: Phaser.Physics.Arcade.Sprite,
			maxSize: 100,
		});
		this.hud.hearts = this.add.group({
			classType: Phaser.Physics.Arcade.Image,
			maxSize: g.playerLife,
		});
		this.hud.plusTexts = this.add.group({
			classType: Phaser.GameObjects.Text,
			runChildUpdate: true,
		});

		this.hud.scoreText = new HudText({scene: this, x: 300, y: 30, text:"test"});
		function createHearts(scene) {
			let x = 30; // x value for hearts
			for (let i = 0; i < g.playerLife; i++) {
				x += 50;
				const heart = scene.add.image(x, 60, "heart");
				heart.setScale(0.3);
				scene.hud.hearts.add(heart);
			}
		}
		createHearts(this);
		/*this.physics.add.collider(sprites.aliens, sprites.friendlyBullets, (alien, bullet) => {
			alien.destroy();
			bullet.destroy();
			g.gameScore += 500;
		});*/
		const explosionAudio = this.sound.add("explosionAudio", {rate: 2, detune: -100, volume: 0.3});
		this.physics.add.overlap(sprites.friendlyBullets, sprites.aliens, (bullet, alien) => {
			//bullet.destroy();
			alien.destroy();
			g.gameScore += g.simpleAlienWorth;
			const randY = Phaser.Math.Between(this.hud.scoreText.y - 20, this.hud.scoreText.y + 80);
			this.hud.plusTexts.add(new PlusHudText({scene: this, x: this.hud.scoreText.x + 100, y: randY, text: `+${g.simpleAlienWorth}`}));
			explosionAudio.play();
		});
		this.physics.add.collider(sprites.ship, sprites.enemyBullets, (ship, bullet) => {
			g.playerLife--;
			const hearts = this.hud.hearts.getChildren(); // getLast method wasn't working (returns null???)
			const last = hearts[hearts.length -1]; // get last item from array
			last.destroy();

			bullet.destroy();
			/*this.bgAudio.rate += 0.05;
			this.bgAudio.detune -= 0.05;*/
			explosionAudio.play(); //TODO: DIFFERENT AUDIO for player collision
		});
		this.physics.add.collider(sprites.aliens, sprites.aliens, (a1, a2) => {
			a1.setVelocityY(a2.body.velocity.y * -1);
		});
		/*this.physics.add.overlap(sprites.friendlyBullets, sprites.enemyBullets, (fBullets, eBullets) => {
			fBullets.destroy();
			eBullets.destroy();
		});*/

		//KEEP AT BOTTOM
		g.sprites = sprites;
	}

	update() {
		g.Main = this;
		g.sprites = this.sprites;
		g.hud = this.hud;

		this.hud.scoreText.text = `Score\n${g.gameScore}`;

		if (this.firingCooldown > 0){
			this.firingCooldown--;
		}
		if (++g.gameTick % 50 === 0) {
			g.gameScore += 5;
		}
		if (g.gameTick % this.alienSpawnRate === 0) {
			if (this.alienSpawnRate <= !50) {
				this.alienSpawnRate -= 20;
			}
			this.generateNewAliens();
		}
		if (g.playerLife === 0) {
			this.scene.stop();
		}
		this.background.updateBackground(); // scrolls background image
		this.checkCursors();
	}

	generateNewAliens() {
		const yVals = [getRandomInt(50, 550), getRandomInt(50, 550), getRandomInt(50,550)];
		let i = getRandomInt(0, 1);
		for (;i < yVals.length; i++) {
			this.sprites.aliens.add(new SimpleAlien({scene: this, x: 2500, y: yVals[i]}));
		}
	}

	fireGun() {
		if (this.firingCooldown === 0) {
			this.firingCooldown = this.firingSpeed;
			const shipX = this.sprites.ship.body.x;
			const shipY = this.sprites.ship.body.y;
			this.sprites.friendlyBullets.add(new FriendlyBullet({scene: this, x: shipX + 175, y: shipY + 30}));
		}
	}

	checkCursors() {
		this.sprites.ship.setVelocityX(0);
		this.sprites.ship.setVelocityY(0);

		if (keyW.isDown) {
			this.sprites.ship.setVelocityY(this.vel * -1);
		} if (keyS.isDown) {
			this.sprites.ship.setVelocityY(this.vel);
		} if (keyA.isDown) {
			this.sprites.ship.setVelocityX(this.vel * -1);
		} if (keyD.isDown) {
			this.sprites.ship.setVelocityX(this.vel)
		} if (keyF.isDown || keySpace.isDown) {
			this.fireGun();
		}

	}

}