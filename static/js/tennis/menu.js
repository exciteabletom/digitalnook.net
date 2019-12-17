export default class MenuScene extends Phaser.Scene {
	constructor() {
		super({key: "menu"});
	}

	preload() {
		this.load.image("logo", "/static/images/tennis/logo.png");
		this.load.image("singlePlayer", "/static/images/tennis/singlePlayer.png");
		this.load.image("multiPlayer", "/static/images/tennis/multiPlayer.png");
	}

	create() {
		const {scene} = this;
		this.add.image(500, 100, "logo").setScale(0.3);
		const singlePlayer = this.add.image(500, 300, "singlePlayer").setScale(0.3)
		const multiPlayer = this.add.image(500, 450, "multiPlayer").setScale(0.3);

		// resets all variables used in games so that it doesn't break the next game that is started, located in "globals.js"
		resetVars();

		multiPlayer.setInteractive();
		singlePlayer.setInteractive();

		singlePlayer.on("pointerup", () => {
			scene.start("singlePlayer");
		});

		multiPlayer.on("pointerup", () => {
			scene.start("multiPlayer");
		})

	}


}
