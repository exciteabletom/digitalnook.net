export default class Load extends Phaser.Scene {
	/**
	 * This scene loads in all the assets needed for a game and displays a loading bar
	 *
	 * Requires a config object with 3 properties:
	 * 1. name {str}: the name of the game being loaded
	 * 2. items {str}: A string containing all the code that needs to be preloaded
	 * 3. scene {str} : the scene to be started after the game is loaded
	 */
	constructor() {
		super("load");

	}
	init(config) {
		this.name = config.name;
		this.loadItems = config.items;
		this.nextScene = config.scene;
	}
	preload() {
		// LOADING SCREEN ASSETS
		this.load.image("logo", "/static/images/logo/fire.png");
		this.load.audio("loadingSound", "/static/audio/loadingSound.mp3");
		this.load.audio("digitalnook.net", "/static/audio/digitalnook.ogg");
		this.load.audio("intro", "/static/audio/spaceAdventure/intro.mp3");

		this.loadingRectangle = this.add.graphics();
		this.loadingRectangle.fillStyle(0xfff);

		this.loadingText = this.add.text(950, 300, "loading . . .", {fontWeight: "bold", fontFamily: '"Lucida Console", Monaco, monospace', fontSize: "50px", align: "center", color: "#FF0000"});
		this.loadingText.setOrigin(this.loadingText.halfWidth, this.loadingText.halfHeight);

		this.load.on("progress", value => {
			this.loadProgress = value;
			this.loadingRectangle.clear();
			this.loadingRectangle.fillStyle(0xffffff, 1);
			this.loadingRectangle.fillRect(0, 200, this.game.canvas.width * value, 200);
		});

		this.load.on("complete", () => {
			this.loadingRectangle.destroy();
			this.loadingText.destroy();
		});

		eval(this.loadItems);  // Is this shit????? I think it might be...
	}
	create() {
		this.loadAudio = this.sound.add("loadingSound", {volume: "0.9"});
		this.digitalnook = this.sound.add("digitalnook.net", {volume: "1.5", detune: ""});
		this.intro = this.sound.add("intro", {volume: "0.4", detune: "100"});
		//this.loadAudio.play();
		this.intro.play();
		this.digitalnook.play();

		this.tick = 0;
		const logo = this.add.image(600, 300, "logo");
		//logo.setOrigin(logo.width /2, logo.height /2);
		this.add.text(logo.x + 200, logo.y -50 , `DigitalNook presents:\n${this.name}️`, {fontSize: "50px", fontFamily: '"Lucida Console", Monaco, monospace', align: "center"});

		this.events.on("update", () => {
			this.tick++;
			if (this.loadAudio.volume > 0){
				this.loadAudio.volume -= 0.0005;
			}

			if (this.tick === 200) {
				this.loadAudio.destroy();
				this.scene.start(`${this.nextScene}`);
			}
		})
	}
};
