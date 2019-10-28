export default class SinglePlayerScene extends Phaser.Scene {

	constructor() {
		super({key: "singlePlayer"});
		resetVars();
	}



	preload() {
		// preload images for use in create()
		this.load.image("ball", "/static/images/tennis/ball.png");
		this.load.image("playerPaddle", "/static/images/tennis/playerPaddle.png");
		this.load.image("compPaddle", "/static/images/tennis/compPaddle.png");
	}

	create() {
		// create default cursors and store it in global var "cursors"
		cursors = this.input.keyboard.createCursorKeys();

		// creates sprites
		this.createSprites();

		// collisions for ball and paddles
		this.physics.add.collider(sprites.playerP, sprites.ball, function() {
			sprites.ball.setVelocityX(1000);
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
				sprites.ball.setVelocityY(randVelocity);
			}
		});

		this.physics.add.collider(sprites.compP, sprites.ball, function() {
			const randVelocityY = getRandomFloat(200, 500);
			const randVelocityX = getRandomFloat(-900, -1000);

			sprites.ball.setVelocityX(randVelocityX);
			if (sprites.playerP.y > 300) {
				sprites.ball.setVelocityY(randVelocityY);
			} else {
				sprites.ball.setVelocityY(randVelocityY * -1);
			}
		});

	}

	update() {
		if (comp.score !== 10 && player.score !== 10) {
			this.checkCursors(); // checks for cursor input
			this.compAi(); // handles computer movement
			this.checkScore(); // checks to see if ball needs to be reset and assigns points
		} else if (player.score === 10) {
			player.score = 0;
			comp.score = 0;
			this.scene.start("winner");
		} else if (comp.score === 10) {
			player.score = 0;
			comp.score = 0;
			this.scene.start("loser");
		}
	}

	checkCursors() {
		// player movement using keyboard input
		if (cursors.down.isDown) {
			sprites.playerP.setVelocityY(800);
		} else if (cursors.up.isDown) {
			sprites.playerP.setVelocityY(-800);
		} else {
			sprites.playerP.setVelocityY(0);
		}
	}

	compAi() {
		// computer AI
		if (sprites.ball.y > sprites.compP.y + 40) {
			sprites.compP.setVelocityY(480);
		} else if (sprites.ball.y < sprites.compP.y - 40) {
			sprites.compP.setVelocityY(-480);
		} else {
			sprites.compP.setVelocityY(0);
		}
	}

	checkScore(){
		if (sprites.ball.body.x > 900) {
			player.score++;
			sprites.ball.x = 500;
			sprites.ball.y = 300;
			sprites.ball.setVelocityX(500);
			sprites.ball.setVelocityY(0);
			console.log(playerScore);
			document.getElementById("playerScore").innerHTML = `Your score: ${player.score}`;
		}
		if (sprites.ball.body.x < 50) {
			comp.score++;
			sprites.ball.x = 500;
			sprites.ball.y = 300;
			sprites.ball.setVelocityX(-500);
			sprites.ball.setVelocityY(0);
			document.getElementById("compScore").innerHTML = `Computer's score: ${comp.score}`;

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
		sprites.ball.setVelocityX(-500); // ball slowly goes to player on boot
		sprites.ball.setVelocityY(0);
	}



}