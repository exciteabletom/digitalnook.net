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
	}

}
class BossAlien extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "bossAlien");
		this.scene = config.scene;
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.setScale(2);
		this.setBounce(0.01);
	}
	update() {
		const {body} = this; // body = this.body
		if (g.gameTick % 50 === 0){
			this.setVelocityX(Phaser.Math.Between(-1000, -300))
		}
		if (g.gameTick % 20 === 0){
			this.setVelocityX(Phaser.Math.Between(300, 800));
			const shipY = g.sprites.ship.body.y;
			const velY = Phaser.Math.Between(300, 500);
			if (shipY > this.body.y) {
				this.setVelocityY(velY);
			} else {
				this.setVelocityY(velY * -1);
			}
		}
		if (g.gameTick % 200 === 0 && Math.random() < 0.95) {
			this.altAttack();
		} if (g.gameTick % 110 === 0 && Math.random() < 0.95) {
			if (g.bossLife > 1000){
				this.attack();
			} else {
				this.altAttack(70);
				this.attack();
				this.altAttack();
			}
		}
	}
	hit(damage= 40) { // runs when boss is hit
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
}

export default class BossBattle extends Phaser.Scene {
	constructor() {
		super("bossBattle");
		this.sprites = {};
		this.hud = {};
		this.warningTimer = 300;
	}

	preload() {
	}

	create() {
		this.bossMusic = this.sound.add("bossMusic", {loop: true, volume: 0.6});
		this.bossMusic1 = this.sound.add("bossMusic1", {loop: true, volume: 0.6});
		this.bossMusic.play();
		this.sprites.bossAlien = new BossAlien({scene: this, x: 3000, y: 300});

		this.sprites.bossBullets = this.add.group({
			className: Phaser.Physics.Arcade.Sprite,
		});

		this.hud.popup = new HudText({scene: this, x: 950, y: 300, text: "DOCTOR 🅱️ APPROACHING "}).setOrigin(0);

		this.physics.add.overlap(g.Main.sprites.friendlyBullets, this.sprites.bossAlien, (bullet, boss) => {
			bullet.destroy();
			this.sprites.bossAlien.hit();
		});
		this.physics.add.collider(g.sprites.ship, this.sprites.bossAlien, () => {
			if (!g.shipShielding){
				g.playerHit();
			}
		});
		this.physics.add.overlap(g.sprites.ship, this.sprites.bossBullets, (ship, bullet) => {
			if (!g.shipShielding){
				bullet.destroy();
				g.playerHit();
			}
		});
		this.physics.add.overlap(g.sprites.friendlyBullets, this.sprites.bossBullets, (f, b) => {
			f.destroy();
		});

		this.events.on("update", () => {
			if (g.playerlife === 0){
				this.bossmusic.stop();
				this.scene.stop();
			}
		})
	}

	update() {
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