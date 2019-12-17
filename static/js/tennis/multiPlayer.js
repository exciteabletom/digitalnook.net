export default class MultiPlayerScene extends Phaser.Scene {
	constructor() {
		super({key: "multiPlayer"});
	}


	preload() {
		// preload images for use in create()
		this.load.image("ball", "/static/images/tennis/ball.png");
		this.load.image("playerPaddle", "/static/images/tennis/playerPaddle.png");
		this.load.image("compPaddle", "/static/images/tennis/compPaddle.png");
	}

	create() {
		this.scene.launch("scoring");
		// add keys W and S
		keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

		// add up arrow and down arrow
		keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

		// creates sprites
		this.createSprites();

		// collisions for ball and paddles
		this.physics.add.collider(sprites.playerP, sprites.ball, () => {
			sprites.ball.setVelocityX(900);

			const playerVelocityY = sprites.playerP.body.velocity.y;
			const bool = getRandomBool();

			if (playerVelocityY !== 0) {
				if (bool === true) { // slight randomness in y velocity
					sprites.ball.setVelocityY(playerVelocityY / 1.3);
				} else {
					sprites.ball.setVelocityY(playerVelocityY / 1.5);
				}
			} else {
				const randVelocity = getRandomFloat(0.5, 1.5) * 100;
				if (bool === true) {
					sprites.ball.setVelocityY(randVelocity);
				} else {
					sprites.ball.setVelocityY(randVelocity * -1);
				}
			}
		});

		this.physics.add.collider(sprites.compP, sprites.ball, () => {
			sprites.ball.setVelocityX(-900);
			const playerVelocityY = sprites.compP.body.velocity.y;

			const bool = getRandomBool();
			if (playerVelocityY !== 0) {
				if (bool === true) { // slight randomness in y velocity
					sprites.ball.setVelocityY(playerVelocityY / 1.3);
				} else {
					sprites.ball.setVelocityY(playerVelocityY / 1.5);
				}
			} else {
				const randVelocity = getRandomFloat(0.5, 1.5) * 100;
				if (bool === true) {
					sprites.ball.setVelocityY(randVelocity);
				} else {
					sprites.ball.setVelocityY(randVelocity * -1);
				}
			}
		});
	}


	update() {
		if (player2.score !== 10 && player1.score !== 10) {
			this.checkCursors(); // checks for cursor input
			this.checkScore(); // checks to see if ball needs to be reset and assigns points
		} else if (player1.score === 10) {
			this.scene.stop("scoring");
			this.scene.start("player1Win");
		} else if (player2.score === 10) {
			this.scene.stop("scoring");
			this.scene.start("player2Win");
		}
	}

	checkCursors() {
		// player1 movement using WASD input
		if (keyS.isDown) {
			sprites.playerP.setVelocityY(800);
		} else if (keyW.isDown) {
			sprites.playerP.setVelocityY(-800);
		} else {
			sprites.playerP.setVelocityY(0);
		}

		// player2 movement using arrow input TODO: why is P2 snappier than P1
		if (keyDown.isDown) {
			sprites.compP.setVelocityY(800);
		} else if (keyUp.isDown) {
			sprites.compP.setVelocityY(-800);
		} else /*if (!keyUp.isDown && !keyDown.isDown)*/ {
			sprites.compP.setVelocityY(0);
		}
	}


	checkScore() {
		if (sprites.ball.body.x > 900) {
			player1.score++;
			sprites.ball.x = 500;
			sprites.ball.y = 300;
			sprites.ball.setVelocityX(500);
			sprites.ball.setVelocityY(0);
		}
		if (sprites.ball.body.x < 50) {
			player2.score++;
			sprites.ball.x = 500;
			sprites.ball.y = 300;
			sprites.ball.setVelocityX(-500);
			sprites.ball.setVelocityY(0);

		}
	}

	createSprites() {
		// adds sprites with physics, changes scale, sets interactive
		sprites.playerP = this.physics.add.sprite(50, 300, "playerPaddle").setScale(0.3).setInteractive();
		sprites.compP = this.physics.add.sprite(950, 300, "compPaddle").setScale(0.3).setInteractive();
		sprites.ball = this.physics.add.sprite(500, 300, "ball").setScale(0.1).setInteractive();

		sprites.playerP.setCollideWorldBounds(true);
		sprites.compP.setCollideWorldBounds(true);
		sprites.ball.setCollideWorldBounds(true);

		sprites.playerP.body.immovable = true;
		sprites.compP.body.immovable = true;

		sprites.ball.setBounce(1); // ball bounces off collisions
		sprites.ball.setVelocityX(-500); // ball slowly goes to player1 on boot
		sprites.ball.setVelocityY(0);
		sprites.ball.setZ(10);
	}


}