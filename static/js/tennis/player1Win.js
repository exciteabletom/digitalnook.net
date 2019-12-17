export default class Player1WinScene extends Phaser.Scene {
	constructor() {
		super({key: "player1Win"});
	}

	preload() {
		this.load.image("player1Win", "/static/images/tennis/player1Win.png");
	}

	create() {
		const {scene} = this;
		let player1Win = this.add.image(0, 0, "player1Win").setOrigin(0, 0);

		player1Win.setInteractive();

		player1Win.on("pointerup", () => {
			scene.start("menu");
		});

	}
}