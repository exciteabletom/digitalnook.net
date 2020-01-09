"use strict";
import Background from "./Background.js";
import { g , getRandomInt } from "./Global.js";
import SimpleAlien from "./SimpleAlien.js";
import { HudText, PlusHudText } from "./HudText.js";
import Ship from "./Ship.js";
import FriendlyBullet from "./FriendlyBullet.js";

let keyW, keyS, keyA, keyD, keyF, keySpace;
export default class Main extends Phaser.Scene {
	constructor() {
		super("main");
		this.sprites = {};
		this.hud = {}; // Heads Up Display Elements
		// bullet vars

		this.alienSpawnRate = 100; // lower is quicker
		this.keys = {};
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
		// BOSS ASSETS
		this.load.audio("bossMusic1", "/static/audio/spaceAdventure/boss1.ogg");
		this.load.audio("bossMusic", "/static/audio/spaceAdventure/boss2.ogg");
	}

	create() {
		const {sprites} = this;
		this.physics.world.setFPS(60); // sets update to run at 60hz doesn't change render fps

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

		this.sprites.ship = new Ship({scene: this, x: 150, y: 300});


		this.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keys.F = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
		this.keys.Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.keys.Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

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

		this.hud.scoreText = new HudText({scene: this, x: 300, y: 30, text:""});
		this.hud.boss= new HudText({scene: this, x: 450, y: 30, text:""});

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

		this.explosionAudio = this.sound.add("explosionAudio", {rate: 2, detune: -100, volume: 0.3});
		this.physics.add.overlap(sprites.friendlyBullets, sprites.aliens, (bullet, alien) => {
			bullet.destroy();
			alien.destroy();
			g.aliensKilled++;
			g.gameScore += g.simpleAlienWorth;
			const randY = Phaser.Math.Between(this.hud.scoreText.y - 20, this.hud.scoreText.y + 80);
			this.hud.plusTexts.add(new PlusHudText({scene: this, x: this.hud.scoreText.x + 100, y: randY, text: `+${g.simpleAlienWorth}`}));
			this.explosionAudio.play();
		});
		this.physics.add.collider(sprites.ship, sprites.enemyBullets, (ship, bullet) => {
			if (!g.shipShielding) {
				g.playerHit();
				bullet.destroy();
				this.explosionAudio.play(); //TODO: DIFFERENT AUDIO for player collision
			}
		});
		this.physics.add.collider(sprites.aliens, sprites.aliens, (a1, a2) => {
			a1.setVelocityY(a2.body.velocity.y * -1);
		});
		this.physics.add.collider(sprites.aliens, sprites.ship);

	}

	update() {
		g.Main = this;
		g.sprites = this.sprites;
		g.hud = this.hud;
		g.gameTick++;
		// TODO: FIX SHIELD MECHANISM IT IS BAD
		if (g.shipShielding > 0){
			g.shipShielding--;
		} else if (g.shieldCooldown > 0) {
			g.shieldCooldown--;
		} else {
			g.shipShielding--
		}
		if (g.playerLife === 0) {
			this.scene.start("gameOver");
		}
		if (g.distanceToBoss !== 0){ // boss not active
			this.hud.boss.text = `Dr. 🅱️'s ship:\n${g.distanceToBoss}m`;
			g.distanceToBoss -= 10;

			if (g.gameTick % this.alienSpawnRate === 0) {
				if (this.alienSpawnRate <= !50) {
					this.alienSpawnRate -= 30;
				}
				this.generateNewAliens();
			}
		}
		else { // boss battle active
			if (!g.boss){
				this.bgAudio.pause();
				this.scene.launch("bossBattle");
			}
			g.boss = true;
			this.hud.boss.text = `Dr. 🅱️:\n${g.bossLife}hp`;
			const aliens = this.sprites.aliens.getChildren();
			for (let i=0; i< aliens.length;i++){
				aliens[i].removeAllListeners();
				aliens[i].destroy();
			}
			const eBullets= this.sprites.enemyBullets.getChildren();
			for (let i=0; i< eBullets.length;i++){
				eBullets[i].removeAllListeners();
				eBullets[i].destroy();
			}
		}

		if (g.playerLife === 0) {
			this.scene.stop();
		}
		if (g.gameTick % 50 === 0) {
			g.gameScore += 5;
		}
		if (g.firingCooldown > 0) {
			g.firingCooldown--;
		}
		this.hud.scoreText.text = `Score:\n${g.gameScore}`;
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
		if (g.firingCooldown === 0) {
			g.firingCooldown = g.firingSpeed;
			const shipX = this.sprites.ship.body.x;
			const shipY = this.sprites.ship.body.y;
			this.sprites.friendlyBullets.add(new FriendlyBullet({scene: this, x: shipX + 175, y: shipY + 30}));
		}
	}
	checkCursors() {
		this.sprites.ship.setVelocityX(0);
		this.sprites.ship.setVelocityY(0);

		if (this.keys.W.isDown) {
			this.sprites.ship.setVelocityY(g.vel * -1);
		} if (this.keys.S.isDown) {
			this.sprites.ship.setVelocityY(g.vel);
		} if (this.keys.A.isDown) {
			this.sprites.ship.setVelocityX(g.vel * -1);
		} if (this.keys.D.isDown) {
			this.sprites.ship.setVelocityX(g.vel);
		} if (this.keys.F.isDown || this.keys.Space.isDown) {
			this.fireGun();
		} if (this.keys.Q.isDown && g.shieldCooldown === 0 && !g.shipShielding) {
			this.sprites.ship.shield(1000);
		}
	}
}