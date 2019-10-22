import "/static/js/phaser.min.js";
import SinglePlayerScene from "./singlePlayerRewrite.js";
import winnerScene from "./winner.js";
import loserScene from "./loser.js";

// Game class for switching between scenes
class Game extends Phaser.Game {
	constructor() {
		super(config); // equiv to Phaser.Game(config);
		this.scene.add("singlePlayer", SinglePlayerScene);
		this.scene.add("winner", winnerScene);
		this.scene.add("loser", loserScene);
		// TODO: multiplayer
		this.scene.start("singlePlayer");
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
	backgroundColor: 0xbfbfbf, // light grey
	physics: {
		default: "arcade", //arcade physids
		arcade: {
			gravity: {y: 0}, // no gravity
			debug: true, // debug physics view
		},
	},
};
window.game = new Game();