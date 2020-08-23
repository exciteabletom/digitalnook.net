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
		this.explosionAudio = this.sound.add("explosionAudio");
		this.levelUp = this.sound.add("levelUp");

		g.runXHR(g.updateScore);

		let resultMessage;
		if (g.gameResult === "loss") {
			resultMessage= "You Died...";
			this.explosionAudio.play();
		} else if (g.gameResult === "win") {
			resultMessage = "You Won!";

			const winningBonus = Math.floor(g.gameScore / 6);
			g.addScore(winningBonus);

			this.levelUp.play();
		} else {
			throw new TypeError("g.gameResult is neither 'loss' or 'win'"); // ensures that g.gameResult is always set
		}
		const resultText = this.add.text(700, 100, resultMessage, {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "50px", color: "#FFF"});

		const scoreMessage = `Your score was ${g.gameScore}`;
		const scoreText = this.add.text(700, 250, scoreMessage, {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "30px", color: "#FFF"});

		const alienMessage = `You killed ${g.aliensKilled} aliens`;
		const alienText = this.add.text(700, 300, alienMessage, {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "30px", color: "#FFF"});

		const playAgainText = this.add.text(700, 400, "Play Again?", {fontFamily: "'Lucida Console', Monaco, monospace", align: "center", fontSize: "40px", color: "#FFF"});
		//this.add.rectangle(playAgainText.x, playAgainText.y, playAgainText.width, playAgainText.height, 0xF2FF66);
		playAgainText.setInteractive();
		playAgainText.on("pointerup", () => {
			resetGlobals();
			this.scene.stop();
			this.scene.start("main");
		});
	}
}
