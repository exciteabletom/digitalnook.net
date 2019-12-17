export default class LoserScene extends Phaser.Scene {
	constructor() {
		super({key: "loser"});
	}

	preload() {
		this.load.image("loserPopup", "/static/images/tennis/loserPopup.png");
	}

	create() {
		const {scene} = this;

		//add image and set interactive
		let loserPopup = this.add.image(0, 0, "loserPopup").setOrigin(0, 0).setInteractive();

		// click event handler
		loserPopup.on("pointerup", () => {
			scene.start("menu");
		});

	}
}