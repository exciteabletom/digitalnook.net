import "/static/js/phaser.min.js";

export default class SinglePlayerScene extends Phaser.Scene {
	// These variables allow me to change the dimensions of the game but keep the movement consistent
	height = game.config.height;
	minusHeight = this.height * -1;
	halfHeight = this.height / 2;
	height10 = this.height / 10;
	height5 = this.height / 5;
	height4 = this.height / 4;

	width = game.config.width;
	minusWidth = this.width * -1;
	halfWidth = this.width / 2;
	width20 = this.width / 20;
	width10 = this.width / 10;
	width5 = this.width / 5;
	width4 = this.width / 4;

	constructor() {
		super({key: "singlePlayer"});
		this.player = {};
		this.comp = {};
		this.gameState = {};
	}


	preload() {
		this.load.image("ball", "/static/images/ball.png");
		this.load.image("playerPaddle", "/static/images/playerPaddle.png");
		this.load.image("compPaddle", "/static/images/compPaddle.png");
		this.load.image("winnerPopup", "/static/images/winnerPopup.png");
		this.load.image("loserPopup", "/static/images/loserPopup.png");
	};

	create() {
		const gameState = this.gameState;
		console.log(game);

		// objects for storing player/comp values
		this.player.score = 0;
		this.comp.score = 0;

		// Makes images using preloaded assets
		gameState.loserPopup = this.add.image(this.halfWidth, this.halfHeight, "loserPopup").setInteractive();
		gameState.winnerPopup = this.add.image(this.halfWidth, this.halfHeight, "winnerPopup").setInteractive();

		// Makes popups invisible so they can be used later
		gameState.loserPopup.setVisible(false);
		gameState.winnerPopup.setVisible(false);

		// Creates main game sprites, scales them, makes them interactive
		gameState.playerPaddle = this.physics.add.sprite(this.width20, this.halfHeight, "playerPaddle").setScale(0.3).setInteractive();
		gameState.compPaddle = this.physics.add.sprite((this.width - this.width20), this.halfHeight, "compPaddle").setScale(0.3).setInteractive();
		gameState.ball = this.physics.add.sprite(this.halfWidth, this.halfHeight, "ball").setScale(0.1).setInteractive();

		// player/ball collision
		this.physics.add.collider(gameState.playerPaddle, gameState.ball, this.playerCollision());

		// comp/ball collision
		this.physics.add.collider(gameState.compPaddle, gameState.ball, this.computerCollision());

		// makes ball bounce during collisions
		gameState.ball.setBounce(1);
		// sets ball to go towards player on first boot
		gameState.ball.setVelocityX(-1000);

		// makes paddles unaffected by balls force
		gameState.playerPaddle.body.immovable = true;
		gameState.compPaddle.body.immovable = true;


		// creates default keyboard inputs
		gameState.cursors = this.input.keyboard.createCursorKeys();

		// ensures sprites never leave game
		gameState.compPaddle.setCollideWorldBounds(true);
		gameState.playerPaddle.setCollideWorldBounds(true);
		gameState.ball.setCollideWorldBounds(true);
	};

	update() {
		const gameState = this.gameState;
		(function () {
			console.log(gameState.playerPaddle, gameState.compPaddle, gameState.ball);
		})();
		// TODO: why does this not scale when window is minimised then maximised?
		// anonymous func to set game size every update
		(function () {
			const gameId = document.getElementById("game");
			// game wrapper div
			gameId.style.width = "60%";
			gameId.style.height = "60%";
			gameId.style.marginRight = "5%";
			// actual game canvas
			game.canvas.style.width = '100%';
			game.canvas.style.height = '100%';
		})();

		if (this.player.score < 10 && this.comp.score < 10) {
			// TODO Mobile compatibility, How will multiplayer work?, swiping gestures or follow finger?
			// ...

			// desktop player controls
			if (gameState.cursors.down.isDown) {
				gameState.playerPaddle.setVelocityY(800);
			} else if (gameState.cursors.up.isDown) {
				gameState.playerPaddle.setVelocityY(-800);
			} else {
				// if no keypress dont move
				gameState.playerPaddle.setVelocityY(0);
			}
			// resets ball if it goes off screen and assigns points to objects
			if (gameState.ball.x >= (950)) {
				this.player.score += 1;
				// resets ball
				gameState.ball.x = 500;
				gameState.ball.y = 300;
				gameState.ball.setVelocityY(0);
				gameState.ball.setVelocityX(this.width);
				// sets <p> elements to
				compScore.innerHTML = `Computer's score: ${this.comp.score}`;
				playerScore.innerHTML = `Your Score: ${this.player.score}`;
			} else if (gameState.ball.x <= 50) {
				this.comp.score += 1;
				//resets ball
				gameState.ball.x = this.halfWidth;
				gameState.ball.y = this.halfHeight;
				gameState.ball.setVelocityY(0);
				gameState.ball.setVelocityX(this.minusWidth);
				// sets results
				compScore.innerHTML = `Computer's score: ${this.comp.score}`;
				playerScore.innerHTML = `Your Score: ${this.player.score}`;
			}
			// computer paddle AI
			if (gameState.ball.x >= 300) {
				if (gameState.ball.y > (gameState.compPaddle.y + 50)) {
					gameState.compPaddle.setVelocityY(450);
				} else if (gameState.ball.y < (gameState.compPaddle.y - 50)) {
					gameState.compPaddle.setVelocityY(-450);
				} else {
					gameState.compPaddle.setVelocityY(0);
				}
			}
		} else { // runs when game is over
			//sets result value
			// TODO: change this to be Phaser native
			playerScore.innerHTML = `Your score: ${this.player.score}`;
			compScore.innerHTML = `Computer's score: ${this.comp.score}`;

			//opens correct scene game invisible

			if (this.player.score === 10) {
				this.scene.start("winnerPopup");
			} else {
				// TODO: add loser scene
				this.scene.start("winnerPopup");
			}

		}

	};

	playerCollision() {
		const gameState = this.gameState;
		console.log(gameState.playerPaddle.body.velocity.y);
		if (gameState.playerPaddle.body.velocity.y === 0) {
			gameState.ball.setVelocityY(100 * -1);
		} else {
			const randNum = Math.random(); // num between 0-1
			// slight randomness in velocity to make game feel more dynamic

			if (randNum <= 0.5) {
				gameState.ball.setVelocityY(this.gameState.playerPaddle.body.velocity.y / 1.9);
			} else if (randNum >= 0.5) {
				gameState.ball.setVelocityY(this.gameState.playerPaddle.body.velocity.y / 1.7);
			}
		}
	};

	computerCollision() {
		if (this.gameState.playerPaddle.y > this.halfHeight) {
			this.gameState.ball.setVelocityY((100 * -1) * (Math.random() * 5));
		} else if (this.gameState.playerPaddle.y < this.halfHeight) {
			this.gameState.ball.setVelocityY(100 * (Math.random() * 5));

		} else if (this.gameState.playerPaddle.y) {
			const num = Math.random(); // number between 0-1

			if (num >= 0.5) {
				this.gameState.ball.setVelocityY(100 * (Math.random() * 5));

			} else {
				this.gameState.ball.setVelocityY((100 * -1) * (Math.random() * 5));

			}
		}
	};
};