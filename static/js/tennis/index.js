import SinglePlayerScene from "./singlePlayerRewrite.js";
import winnerScene from "./winner.js";
import LoserScene from "./loser.js";
import MenuScene from "./menu.js";

// Game class for switching between scenes
class Game extends Phaser.Game {
	constructor() {
		super(config); // equiv to Phaser.Game(config);

		this.input.setDefaultCursor("url(/static/images/cursors/tennis.cur), pointer");
		this.scene.add("singlePlayer", SinglePlayerScene);
		this.scene.add("winner", winnerScene);
		this.scene.add("loser", LoserScene);
		this.scene.add("menu", MenuScene);
		// TODO: multiplayer
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