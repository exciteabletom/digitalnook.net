import Menu from "./Menu.js";
import Main from "./Main.js";

class Game extends Phaser.Game {
	constructor() {
		super(config); // equivalent to Phaser.Game(config)

		this.scene.add("menu", Menu);
		this.scene.add("main", Main);

		this.scene.start("main");
	}

}

let config = {
	type: Phaser.CANVAS,
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
		}
	},
	pixelArt: true,
};
window.addEventListener("load", () => {
	window.game = new Game();
});
