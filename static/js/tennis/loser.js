import "/static/js/phaser.min.js";
export default class loserScene extends Phaser.Scene {
	constructor() {
		super({key: "loser"});
	}

	preload() {
		this.load.image("loserPopup", "/static/images/loserPopup.png");
	}

	create() {
		const global = this;
		// cursor image
		this.input.setDefaultCursor("url(/static/images/cursors/tennis.cur), pointer");
		//add image and set interactive
		const loserPopup = this.add.image(0, 0, "loserPopup").setOrigin(0,0).setInteractive();
		// click event handler
		loserPopup.on("pointerUp", function() {
			global.scene.start("singlePlayer");
		})
	}
}