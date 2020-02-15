export default class WinnerScene extends Phaser.Scene {
	constructor() {
		super({key: "winner"});
	}

	preload() {
	}

	create() {
		const {scene} = this; // allows the use of global to replaces "this" in anonymous functions
		let winnerPopup = this.add.image(0, 0, "winnerPopup");

		winnerPopup.setOrigin(0, 0).setInteractive();

		// when popup is clicked start menu
		winnerPopup.on("pointerup", function () {
			scene.start("menu"); // implied "this"
		});
	}
};