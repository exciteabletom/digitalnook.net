import "/static/js/phaser.min.js";
export default class LoserScene extends Phaser.Scene {
	constructor() {
		super({key: "loser"});
	}

	preload() {
		this.load.image("loserPopup", "/static/images/loserPopup.png");
	}

	create() {
		const {scene} = this;

		//add image and set interactive
		const loserPopup = this.add.image(0, 0, "loserPopup").setOrigin(0,0).setInteractive();

		// click event handler
		loserPopup.on("pointerup", () => {
			scene.start("singlePlayer");
		});

	}
}