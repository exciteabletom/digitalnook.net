export default class Load extends Phaser.Scene {
	/**
	 * This scene loads in all the assets needed for the game and displays a loading bar
	 */
	constructor() {
		super("load");
		this.loadProgress = 0;
	}

	preload() {


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

		// GAME ASSETS
		this.load.spritesheet("ship",
			"/static/images/spaceAdventure/sheet/shipSheet.png",
			{frameWidth: 52, frameHeight: 30,}
		);

		// LOADING SCREEN ASSETS
		this.load.image("logo", "/static/images/logo/fire.png");
		this.load.audio("loadingSound", "/static/audio/spaceAdventure/loadingSound.mp3");
		this.load.audio("digitalnook.net", "/static/audio/digitalnook.ogg");
		this.load.audio("intro", "/static/audio/spaceAdventure/intro.mp3");

		//GAME ASSETS
		this.load.image("heart", "/static/images/spaceAdventure/heart.png");
		this.load.image("friendlyBullet", "/static/images/spaceAdventure/friendlyBullet.png");
		this.load.image("enemyBullet", "/static/images/spaceAdventure/enemyBullet.png");
		this.load.image("simpleAlien", "/static/images/spaceAdventure/simpleAlien.png");
		this.load.image("background", "/static/images/spaceAdventure/background.jpg");
		this.load.audio("explosionAudio", "/static/audio/spaceAdventure/explosion.wav");
		this.load.audio("playerHit", "/static/audio/spaceAdventure/playerHit.mp3");
		this.load.audio("fireGun", "/static/audio/spaceAdventure/fireGun.mp3");
		this.load.audio("fireGun1", "/static/audio/spaceAdventure/fireGun1.mp3");
		this.load.audio("fireGun2", "/static/audio/spaceAdventure/fireGun2.mp3");
		this.load.audio("levelUp", "/static/audio/spaceAdventure/levelUp.ogg");
		this.load.audio("powerUp", "/static/audio/spaceAdventure/powerUp.mp3");

		// BACKGROUND TUNES
		this.load.audio("main0", "/static/audio/spaceAdventure/main.ogg");
		this.load.audio("main1", "/static/audio/spaceAdventure/main1.ogg");
		this.load.audio("main2", "/static/audio/spaceAdventure/main2.ogg");

		// BOSS FIGHT ASSETS

		this.load.image("bossAlien", "/static/images/spaceAdventure/simpleAlien.png"); // TODO: PLACEHOLDER IMAGE CHANGE LATER
		this.load.audio("boss0", "/static/audio/spaceAdventure/boss.ogg");
		this.load.audio("boss1", "/static/audio/spaceAdventure/boss1.ogg");
		this.load.audio("boss2", "/static/audio/spaceAdventure/boss2.ogg");
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
		this.add.text(logo.x + 200, logo.y -50 , "DigitalNook presents:\nDoctor 🅱️", {fontSize: "50px", fontFamily: '"Lucida Console", Monaco, monospace', align: "center"});

		this.events.on("update", () => {
			this.tick++;
			if (this.loadAudio.volume > 0){
				this.loadAudio.volume -= 0.0005;
			}

			if (this.tick === 200) {
				this.loadAudio.destroy();
				this.scene.start("main");
			}
		})
	}
};