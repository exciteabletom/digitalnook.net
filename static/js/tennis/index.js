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
import SinglePlayerScene from "./singlePlayerRewrite.js";
import WinnerScene from "./winner.js";
import LoserScene from "./loser.js";
import MenuScene from "./menu.js";
import MultiPlayerScene from "./multiPlayer.js";
import Player1WinScene from "./player1Win.js";
import Player2WinScene from "./player2Win.js";
import ScoringScene from "./scoring.js";

// Game class for switching between scenes
class Game extends Phaser.Game {
	constructor() {
		super(config); // equiv to Phaser.Game(config);
		// sets cursor for entire game
		this.input.setDefaultCursor("url(/static/images/cursors/tennis.cur), pointer");

		this.scene.add("singlePlayer", SinglePlayerScene);
		this.scene.add("multiPlayer", MultiPlayerScene);
		this.scene.add("winner", WinnerScene);
		this.scene.add("loser", LoserScene);
		this.scene.add("player1Win", Player1WinScene);
		this.scene.add("player2Win", Player2WinScene);
		this.scene.add("scoring", ScoringScene);

		this.scene.add("menu", MenuScene);
		this.scene.start("menu");

	}
}

let config = { // config obj for creating Phaser.Game() instance
	type: Phaser.AUTO,
	scale: {
		parent: "game", // container div
		mode: Phaser.Scale.FIT, //fit div
		width: 1000, // 1000px
		height: 600, // 600px

	},
	backgroundColor: 0xFE8F00, // light orange
	physics: {
		default: "arcade", // arcade physics
		arcade: {
			gravity: {y: 0}, // no gravity
			//debug: true, // debug physics view
		},
	},
};
window.game = new Game();
