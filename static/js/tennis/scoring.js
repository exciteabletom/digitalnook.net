export default class ScoringScene extends Phaser.Scene {
	constructor() {
		super({key: "scoring"});
		this.p1Text = null;
		this.p2Text = null;
		this.newScore = 0;
		this.oldScore = null;
		this.count = 0;
	}

	create() {
		this.add.rectangle(500, 0, 5, 600);

		// player 1 score text
		this.p1Text = this.add.text(300, 30, "0", textConfig);

		// player 2 score text
		this.p2Text = this.add.text(700, 30, "0", textConfig);

		this.oldScore = player1.score + player2.score;
	}
	update() {
		this.newScore = player1.score + player2.score;
		if (this.oldScore !== this.newScore) {
			this.oldScore = this.newScore
			// saves on execution time
			this.updateScores();
			if (player1.score > player2.score) {
				this.player1Winning();
			} else if (player1.score < player2.score) {
				this.player2Winning();
			} else {
				this.playerDraw();
			}
		}
	}
	player1Winning() {
		this.p1Text.setFill(green);
		this.p2Text.setFill(red);
	}

	player2Winning() {
		this.p1Text.setFill(red);
		this.p2Text.setFill(green);
	}

	playerDraw() {
		this.p1Text.setFill(red);
		this.p2Text.setFill(red);
	}

	updateScores() {
		this.p1Text.setText(player1.score);
		this.p2Text.setText(player2.score);
	}
}