/**
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Thomas C. Dougiamas
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

export default class MultiPlayerScene extends Phaser.Scene {
	constructor() {
		super({key: "multiPlayer"});
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