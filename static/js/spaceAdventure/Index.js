import Menu from "./Menu.js";
import Main from "./Main.js";
import Bullet from "./Bullet.js";

class Game extends Phaser.Game {
	constructor() {
		super(config); // equivalent to Phaser.Game(config)

		this.scene.add("menu", Menu);
		this.scene.add("main", Main);

		this.scene.start("main");
	}

}

let config = {
	type: Phaser.AUTO,
	backgroundColor: "#000",
	scale: {
		parent: "game",
		mode: Phaser.Scale.FIT,
		width: 1200,
		height: 600,
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 0},
			debug: true,
		}
	}
};

window.game = new Game();