import "/static/js/phaser.min.js";

export default class singlePlayerScene extends Phaser.Scene {

	constructor() {
		super({key: "singlePlayer"});
		// store player values
		this.player = {score: 0};
		this.comp = {score: 0};
		// store sprites in global obj
		this.sprites = {};
		// cursors
		this.cursors = undefined;
	}

	preload() {
		// preload images for use in create()
		this.load.image("ball", "/static/images/ball.png");
		this.load.image("playerPaddle", "/static/images/playerPaddle.png");
		this.load.image("compPaddle", "/static/images/compPaddle.png");
	}

	create() {
		const global = this;
		this.createSprites();
		this.cursors = this.input.keyboard.createCursorKeys();
		// collisions for ball and paddles
		this.physics.add.collider(this.sprites.playerP, this.sprites.ball, playerCollision());
		this.physics.add.collider(this.sprites.compP, this.sprites.ball, compCollision());
		// player/ball collision
		function playerCollision() {
			const playerVelocityY = this.sprites.playerP.body.velocityY;
			const bool = global.getRandomBool();
			if (playerVelocityY !== 0) {
				if (bool === true) { // slight randomness in y velocity
					this.sprites.ball.setVelocityY(playerVelocityY / 1.3);
				} else {
					this.sprites.ball.setVelocityY(playerVelocityY / 1.5);
				}
			} else {
				const randVelocity = global.getRandomFloat(0.5, 1.5) * 100;
				this.sprites.ball.setVelocityY(randVelocity);
			}
		}
		// comp/ball collision
		function compCollision() {
			const randVelocity = global.getRandomFloat(4, 8) * 100;
			if (this.sprites.playerP.y > 300) {
				this.sprites.ball.setVelocityY(randVelocity);
			} else {
				this.sprites.ball.setVelocityY(randVelocity * -1);
			}
		}
	}

	update() {
		if (this.comp.score !== 10 && this.player.score !== 10) {
			this.checkCursors(); // checks for cursor input
			this.compAi(); // handles computer movement
			this.checkScore(); // checks to see if ball needs to be reset and assigns points
		} else {
			// checks who won and displays appropriate end screen
			if (this.player.score === 10) {
				this.scene.start("winner");
			} else if (this.comp.score === 10) {
				this.scene.start("loser");
			}
		}
	}

	checkCursors() {
		// player movement using keyboard input
		if (this.cursors.down.isDown) {
			this.sprites.playerP.setVelocityY(800);
		} else if (this.cursors.up.isDown) {
			this.sprites.playerP.setVelocityY(-800);
		} else {
			this.sprites.playerP.setVelocityY(0);
		}
	}

	compAi() {
		// computer AI
		const aiBool = this.getRandomBool(); // random bool used for slight randomness in comp movement
		if (this.sprites.ball.y > this.sprites.compP.y + 50) {
			if (aiBool === true) {
				this.sprites.compP.setVelocityY(600);
			} else {
				this.sprites.compP.setVelocityY(650);
			}
		} else if (this.sprites.ball.y < this.sprites.compP.y - 50) {
			if (aiBool === true) {
				this.sprites.compP.setVelocityY(-600);
			} else {
				this.sprites.compP.setVelocityY(-650);
			}
		} else {
			this.sprites.compP.setVelocityY(0);
		}
	}

	checkScore(){
		if (this.sprites.ball.x > 950) {
			this.player.score++;
			this.sprites.ball.setVelocityX(100);
		}
		if (this.sprites.ball.x < 50) {
			this.comp.score++;
			this.sprites.ball.setVelocityX(-100);
		}
	}

	createSprites() {
		// adds sprites with physics, changes scale, sets interactive
		this.sprites.playerP = this.physics.add.sprite(50, 300, "playerPaddle").setScale(0.3).setInteractive();
		this.sprites.compP = this.physics.add.sprite(950, 300, "compPaddle").setScale(0.3).setInteractive();
		this.sprites.ball = this.physics.add.sprite(500, 300, "ball").setScale(0.1).setInteractive();

		this.sprites.playerP.setCollideWorldBounds(true);
		this.sprites.compP.setCollideWorldBounds(true);
		this.sprites.ball.setCollideWorldBounds(true);

		this.sprites.playerP.body.immovable = true;
		this.sprites.compP.body.immovable = true;


		this.sprites.ball.setBounce(1); // ball bounces off collisions
		this.sprites.ball.setVelocityX(-100); // ball slowly goes to player on boot
		this.sprites.ball.setVelocityY(0);
	}

	compCollision() {
		const randVelocity = this.getRandomFloat(4, 8) * 100;
		if (this.sprites.playerP.y > 300) {
			this.sprites.ball.setVelocityY(randVelocity);
		} else {
			this.sprites.ball.setVelocityY(randVelocity * -1);
		}
	}

	getRandomBool() {
		return Math.random() < 0.5; // returns true if condition is met false otherwise
	}

	getRandomFloat(min, max) {
		return Math.random() * (max - min) + min; // gets a float between max and min values
	}

	getRandomInt(min, max) {
		return Math.round(Math.random() * (max - min) + min); // gets a integer between max and min values
	}

}