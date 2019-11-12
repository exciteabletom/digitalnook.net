export default class DrawScene extends Phaser.Scene {

	constructor() {
		super("draw");
		this.cursors = undefined;
		this.config = {
			brushSize: 20,
			brushColor: "black",
		}
	}

	preload() {
		this.load.image("black", "/static/images/dot.png");
	}

	create() {
		console.log("Hello!");
		const {add} = this;

		this.input.mousePointer.on("pointermove", pointer => {
			add.image(pointer.x, pointer.y, this.config.size, this.config.size, "black");
		})

	}

	update() {

	}
}