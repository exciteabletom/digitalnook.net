"use strict";
import Background from "./Background.js";
import { g , getRandomInt } from "./Global.js";
import SimpleAlien from "./SimpleAlien.js";
import { HudText, PlusHudText } from "./HudText.js";
import Ship from "./Ship.js";
import FriendlyBullet from "./FriendlyBullet.js";
import HeartPowerUp from "./HeartPowerUp.js"
export default class Main extends Phaser.Scene {
	constructor() {
		super("main");
		this.sprites = {};
		this.hud = {}; // Heads Up Display Elements
		this.keys = {};
	}

	create() {
		const {sprites} = this;
		this.physics.world.setFPS(60); // sets update to run at 60hz doesn't change render fps
		this.powerupAudio = this.sound.add("powerUp");
		this.playerHitAudio = this.sound.add("playerHit");

		this.fireGunAudio = this.sound.add("fireGun");
		this.fireGun1Audio = this.sound.add("fireGun1", {volume: 0.5});
		this.fireGun2Audio = this.sound.add("fireGun2", {volume: 0.5});

		this.bgAudio = this.sound.add(g.getRandTrack("main"));
		this.bgAudio.play({loop: true, rate: 1, detune: 200, volume : "0.4"});

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
			maxSize: 20,
			runChildUpdate: true
		});
		sprites.enemyBullets = this.add.group({
			classType: Phaser.Physics.Arcade.Sprite,
			maxSize: 50,
			runChildUpdate: true
		});
		sprites.hearts = this.add.group({
			classType: Phaser.Physics.Arcade.Sprite,
			maxSize: 2,
			runChildUpdate: true,
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
		this.hud.highScore = new HudText({scene: this, x: 1600, y: 30, text:`High Score:\n${g.highScore}`});

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
			g.addScore(g.simpleAlienWorth);
			const detune = Phaser.Math.FloatBetween(-700, 100).toString();
			this.explosionAudio.play({detune: detune});
		});

		this.physics.add.collider(sprites.ship, sprites.enemyBullets, (ship, bullet) => {
				g.playerHit();
				bullet.destroy();
				this.explosionAudio.play(); //TODO: DIFFERENT AUDIO for player collision
		});

		this.physics.add.overlap(sprites.friendlyBullets, sprites.enemyBullets, (f, e) => {
			f.destroy();
			e.destroy();
			g.addScore(30);
		});

		this.physics.add.collider(sprites.aliens, sprites.aliens);
		this.physics.add.collider(sprites.aliens, sprites.ship, (alien, ship) => {
			alien.destroy();
			g.playerHit();
		});
		this.physics.add.overlap(sprites.ship, sprites.hearts, (ship, heart) => {
			g.addLife();
			this.powerupAudio.play();
			heart.destroy();
		});

		g.Main = this;
		g.sprites = this.sprites;
		g.hud = this.hud;
	}

	update() {
		g.Main = this;
		g.sprites = this.sprites;
		g.hud = this.hud;
		g.gameTick++;

		if (g.gameScore > g.highScore) {
			g.highScore = g.gameScore;
			this.hud.highScore.text = `High Score:\n${g.highScore}`;
		}

		if (g.gameResult) {
				this.bgAudio.destroy();
				this.scene.stop();
				this.scene.start("endCard");
		}
		else if (g.playerLife === 0) {
			g.gameResult = "loss";
		}
		if (g.distanceToBoss > 0){ // boss not active
			this.hud.boss.text = `Dr. 🅱️'s ship:\n${g.distanceToBoss}m`;
			g.distanceToBoss -= 9;

			if (g.gameTick % g.alienSpawnRate === 0) {
				if (g.alienSpawnRate > 100) {
					g.alienSpawnRate -= 1;
				}
				this.generateNewAliens();
			}
		}
		else { // boss battle active
			if (!g.boss){
				this.bgAudio.pause();
				this.scene.launch("bossBattle"); // starts boss battle alongside Main mechanics
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

		if (g.gameTick % 50 === 0) {
			g.addScore(10);
		}
		if  (g.gameTick % 100 === 0 && g.playerLife <= 2 && Math.random() < 0.2){
			this.spawnPowerUp();
		}

		if (g.firingCooldown > 0) {
			g.firingCooldown--;
		}
		this.hud.scoreText.text = `Score:\n${g.gameScore}`;
		this.background.updateBackground(); // scrolls background image
		this.checkCursors();
	}

	spawnPowerUp(type=null) { // TODO different types of powerups
		if (this.sprites.hearts.getChildren().length === 0) {
			const randY = Phaser.Math.Between(0, 600);
			if (Math.random() < 0.5) {
				this.sprites.hearts.add(new HeartPowerUp({scene: this, x: 1800, y: randY}))
			}
		}

	}

	generateNewAliens() {
		const yVals = [getRandomInt(0, 200), getRandomInt(200, 400), getRandomInt(400, 500)];

		for (let i = Phaser.Math.Between(0, 1); i < yVals.length; i++) {
			this.sprites.aliens.add(new SimpleAlien({scene: this, x: 2500, y: yVals[i]}));
		}
	}
	fireGun() {
		if (g.firingCooldown === 0) {
			/*const randAudio = Phaser.Math.Between(0, 2);
			switch (randAudio){
				case 0:
					this.fireGunAudio.play();
					break;
				case 1:
					this.fireGun1Audio.play();
					break;
				case 2:
					this.fireGun2Audio.play();
			}*/
			this.fireGunAudio.play({volume: "0.8"});
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
			this.sprites.ship.setVelocityY(g.shipVel * -1);
		} if (this.keys.S.isDown) {
			this.sprites.ship.setVelocityY(g.shipVel);
		} if (this.keys.A.isDown) {
			this.sprites.ship.setVelocityX(g.shipVel * -1);
		} if (this.keys.D.isDown) {
			this.sprites.ship.setVelocityX(g.shipVel);
		} if (this.keys.F.isDown || this.keys.Space.isDown) {
			this.fireGun();
		}
		}
}