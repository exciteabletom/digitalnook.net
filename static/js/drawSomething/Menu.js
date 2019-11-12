export default class Menu extends Phaser.Scene {
	constructor(){
		super("menu");
		this.button1 = undefined;
		this.button2 = undefined;
	}

	preload() {
		//buttons as Phaser Shape and text this time?
	}

	create() {
		this.button1 = this.add.rectangle(200, 400, 960, 540).setInteractive();
		this.button2 = this.add.rectangle(400, 600, 960, 540).setInteractive();
		this.add.text(); // finish text objs onw for each button and one for title

		this.button1.on("pointerup", () => {
			this.scene.start("findPlayer");
		});

		this.button2.on("pointerup", () => {
			this.scene.start("options");
		});

	}

	update() {

	}
}