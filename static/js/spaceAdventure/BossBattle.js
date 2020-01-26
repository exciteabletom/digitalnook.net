import {HudText} from "./HudText.js";
import {g} from "./Global.js";
//1900x600
class BossBullet extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "enemyBullet");
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.setScale(config.scale);
		this.setAngle(180);
		this.setVelocityX(-800);
		this.health = 3;
	}

	update() {
		if (this.body.x < this.body.width * -1) {
			this.destroy();
		}
	}

}
class BossAlien extends Phaser.Physics.Arcade.Sprite {
	/**
	 * Alternates between three different attacks each assigned a method
	 * @method attack
	 * series of 3 small bullets
	 * @method altAttack
	 * one large bullet
	 * @method bossRush
	 * rarely the boss will charge at the player and inflict damage if hit.
	 * It also stops firing during the charge allowing the player to get some hits in.
	 *
	 * @method update
	 * coordinates when attacks/movements should trigger
	 * @method hit
	 * runs everytime the boss gets hit
	 *
	 * @param config {Object}
	 */
	constructor(config) {
		super(config.scene, config.x, config.y, "bossAlien");
		this.scene = config.scene;
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);

		this.currentAttack = true; // bool used to toggle between two attacks
		this.firingSpeed = 100;
		this.internalTick = 0;
		this.bossRushActive = false; // true if boss is doing rush attack

		this.setScale(2);
		this.setBounce(0.01);
	}
	update() {
		this.internalTick++;
		if (g.bossLife < 1000 && !this.firingIncreased) {
			this.firingSpeed = this.firingSpeed / 2;
			this.firingIncreased = true;
		}
		if (!this.bossRushActive) {
			if (this.internalTick % 20 === 0 ) {
				this.setVelocityX(Phaser.Math.Between(300, 800));
				const shipY = g.sprites.ship.body.y;
				const velY = Phaser.Math.Between(300, 500);
				if (shipY > this.body.y) {
					this.setVelocityY(velY);
				} else {
					this.setVelocityY(velY * -1);
				}
			}
			if (g.gameTick % this.firingSpeed === 0 && Math.random() < 0.95) {
				this.currentAttack ? this.altAttack() : this.attack();
				this.currentAttack = !this.currentAttack;
			}
			if (this.internalTick % 700 === 0) {
				// Boss Rush Attack
				this.bossRush();
			}
		}

		if (this.bossRushActive) {
			if (this.rushStartTick + 100 === this.internalTick){
				// ends bossRush attack
				this.bossRush(false);
			}
		}

	}

	hit(damage= 25) { // runs when boss is hit
		g.bossLife -= damage;
		g.Main.explosionAudio.play();
	}

	attack() {
		const y = this.body.y; //+ this.body.halfHeight;
		const diff = 90; // The gap between bullets
		for (let i=0; i < 3; i++) {
			this.scene.sprites.bossBullets.add(new BossBullet({
				scene: this.scene,
				x: this.body.x,
				y: y + diff *i,
				scale: Phaser.Math.Between(7, 10),
			}));
		}
	}

	altAttack(diff = 0) {
		this.scene.sprites.bossBullets.add(new BossBullet({
			scene: this.scene,
			x: this.body.x,
			y: (this.body.y + this.body.halfHeight) + diff,
			scale: 13,
		}))
	}

	bossRush(start=true) {
		if (start) {
			this.bossRushActive = true;
			this.rushStartTick = this.internalTick;
			this.setVelocityX(-800);
			this.setVelocityY(Phaser.Math.Between(-90, 90))
		} else {
			this.setVelocityX(2000);
			setTimeout(() => {
				this.bossRushActive = false;
			}, 1000)
		}
	}
}

export default class BossBattle extends Phaser.Scene {
	constructor() {
		super("bossBattle");
		this.sprites = {};
		this.hud = {};
		this.warningTimer = 300;
	}

	create() {

		this.bossMusic = this.sound.add(g.getRandTrack("boss"));

		this.bossMusic.play({loop: true, volume: 0.6});
		this.sprites.bossAlien = new BossAlien({scene: this, x: 3000, y: 300});

		this.sprites.bossBullets = this.add.group({
			className: Phaser.Physics.Arcade.Sprite,
			runChildUpdate: true,
		});

		this.hud.popup = new HudText({scene: this, x: 950, y: 300, text: "DOCTOR 🅱️ APPROACHING "}).setOrigin(0);

		this.physics.add.overlap(g.Main.sprites.friendlyBullets, this.sprites.bossAlien, (bullet, boss) => {
			bullet.destroy();
			this.sprites.bossAlien.hit();
		});
		this.physics.add.collider(g.sprites.ship, this.sprites.bossAlien, (ship, boss) => {
				g.playerHit();
				boss.setVelocityX(1000);
		});
		this.physics.add.overlap(g.sprites.ship, this.sprites.bossBullets, (ship, bullet) => {
				bullet.destroy();
				g.playerHit();
		});
		this.physics.add.overlap(g.sprites.friendlyBullets, this.sprites.bossBullets, (f, b) => {
			b.health -= 1;
			b.setAlpha(b.alpha - 0.2);
			if (b.health <= 0) {
				b.destroy();
				g.addScore(100);
			}
			f.destroy();
		});

		/*this.events.on("update", () => {
			if (g.playerlife === 0){
				this.bossmusic.stop();
				this.scene.stop();
			}
		})*/

	}

	update() {
		if (g.playerLife === 0 ){
			// g.gameResult is set to 'loss' in main
			this.warningTimer = 300;
			this.bossMusic.stop();
			this.scene.stop();
		} else if (g.bossLife <= 0){
			g.gameResult = "win";
			g.aliensKilled += 1;
			this.warningTimer = 300;
			g.addScore(parseInt(g.gameScore /6));
			this.bossMusic.stop();
			this.scene.stop();
		}

		if (this.warningTimer === 0){
			this.sprites.bossAlien.update();
		} else {
			if (--this.warningTimer === 0){
				this.hud.popup.destroy();
				this.sprites.bossAlien.setPosition(1700, 300);
				this.sprites.bossAlien.setCollideWorldBounds(true);
			}
		}
	}
}