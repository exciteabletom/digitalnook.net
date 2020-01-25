import Main from "./Main.js";
import BossBattle from "./BossBattle.js";
import EndCard from "./EndCard.js";
import Load from "./Load.js";
class Game extends Phaser.Game {
	constructor() {
		super(config); // equivalent to Phaser.Game(config)

		this.scene.add("load", Load);
		this.scene.add("main", Main);
		this.scene.add("bossBattle", BossBattle);
		this.scene.add("endCard", EndCard);

		this.scene.start("load");
	}
}

let config = {
	type: Phaser.AUTO,
	backgroundColor: "#000",
	scale: {
		parent: "game",
		mode: Phaser.Scale.FIT,
		width: 1900,
		height: 600,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: true,
		},
	},
	pixelArt: true,
};
new Game(); // init game

