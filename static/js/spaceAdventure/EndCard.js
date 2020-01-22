import {g, resetGlobals }from "./Global.js";
export default class EndCard extends Phaser.Scene {
	/**
	 *This scene is triggered from Main when the game ends.
	 *It relies on the g.gameResult string being either "win" or "loss"
	 */
	constructor() {
		super("endCard");
	}
	create() {
		this.physics.world.setFPS(5); // reduces processing required for end screen
		let resultMessage;
		if (g.gameResult === "loss") {
			resultMessage= "You Died...";
			g.Main.explosionAudio.play();
		} else if (g.gameResult === "win") {
			resultMessage= "You Won!";
		} else {
			throw new TypeError("g.gameResult is neither 'loss' or 'win'"); // ensures that g.gameResult is always set
		}
		const resultText = this.add.text(700, 100, resultMessage, {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "50px"});

		const scoreMessage = `Your score was ${g.gameScore}`;
		const scoreText = this.add.text(700, 250, scoreMessage, {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "30px"});

		const alienMessage = `You killed ${g.aliensKilled} aliens`;
		const alienText = this.add.text(700, 300, alienMessage, {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "30px"});

		const playAgainText = this.add.text(700, 400, "Play Again?", {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "40px"});
		//this.add.rectangle(playAgainText.x, playAgainText.y, playAgainText.width, playAgainText.height, 0xF2FF66);
		playAgainText.setInteractive();
		playAgainText.on("pointerup", () => {
			resetGlobals();
			this.scene.stop();
			this.scene.start("main");
		});
	}
}
