import "/static/js/phaser.min.js";
export default class WinnerScene extends Phaser.Scene {
	constructor() {
		super({key: "winner"});
	}

	preload() {
		this.load.image("winnerPopup", "/static/images/winnerPopup.png");
	}

	create() {
		const global = this; // allows the use of global to replaces "this" in anonymous functions
		let winnerPopup = this.add.image(0, 0, "winnerPopup");

		winnerPopup.setOrigin(0, 0).setInteractive();
		// when popup is clicked start singlePlayer Game
		winnerPopup.on("pointerup",function(){
			global.scene.start("menu"); // global == this == WinnerScene
		});
	}
};