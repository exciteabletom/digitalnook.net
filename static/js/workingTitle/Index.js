"use strict";
import Load from "../Load.js"
import Menu from "./Menu.js"
class Game extends Phaser.Game {
	constructor() {
		super(config);
		this.scene.add("load", Load);
		this.scene.add("menu", Menu);

		this.scene.start("load", {
			name: "dev",
			scene: "menu",
			items:
				`
				// All items to be preloaded			
				
				`
		});

	}
}

let config = {
	type: Phaser.AUTO,
	backgroundColor: "#20911b",
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


new Game();