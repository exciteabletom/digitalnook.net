import Menu from "./Menu.js";
import Main from "./Main.js";
import BossBattle from "./BossBattle.js";

class Game extends Phaser.Game {
	constructor() {
		super(config); // equivalent to Phaser.Game(config)

		this.scene.add("menu", Menu);
		this.scene.add("main", Main);
		this.scene.add("bossBattle", BossBattle);

		this.scene.start("main");
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
			//debug: true,
			fps: 60,
		},
	},
	pixelArt: true,
};
new Game(); // init game

