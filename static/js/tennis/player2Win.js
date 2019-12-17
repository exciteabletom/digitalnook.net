export default class Player2WinScene extends Phaser.Scene {
	constructor() {
		super({key: "player2Win"});
	}

	preload() {
		this.load.image("player2Win", "/static/images/tennis/player2Win.png");
	}

	create() {
		const {scene} = this;
		let player2Win = this.add.image(0, 0, "player2Win").setOrigin(0, 0);

		player2Win.setInteractive();

		player2Win.on("pointerup", () => {
			scene.start("menu");
		});

	}
}