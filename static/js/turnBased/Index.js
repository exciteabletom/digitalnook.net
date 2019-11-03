import Menu from "./Menu.js"
export default class Game extends Phaser.Game {

	constructor() {
		super(config);
	}

	create() {
		this.load.scene("menu", Menu);
		this.scene.add("settings", Settings);
		this.scene.add("findPlayer", FindPlayer);

	}
}

const config = {
	type: Phaser.AUTO,
	scale: {
		parent: "game", // container div
		mode: Phaser.Scale.FIT, //fit div
		width: 1920, // 16
		height: 1080, // by 9

	},
	backgroundColor: 0xFE8F00, // light blue
	physics: {
		default: "arcade", //arcade physics
		arcade: {
			gravity: {y: 100}, // 100 gravity
//			debug: true, // debug physics view
		},
	},
};