export default class Load extends Phaser.Scene {
	/**
	 * This scene loads in all the assets needed for the game and displays a loading bar
	 */
	constructor() {
		super("load");
	}

	preload() {
		this.load.spritesheet("ship",
			"/static/images/spaceAdventure/sheet/shipSheet.png",
			{frameWidth: 52, frameHeight: 30,}
		);
		this.load.image("heart", "/static/images/spaceAdventure/heart.png");
		this.load.image("friendlyBullet", "/static/images/spaceAdventure/friendlyBullet.png");
		this.load.image("enemyBullet", "/static/images/spaceAdventure/enemyBullet.png");
		this.load.image("simpleAlien", "/static/images/spaceAdventure/simpleAlien.png");
		this.load.image("background", "/static/images/spaceAdventure/background.jpg");
		this.load.audio("backgroundAudio", "/static/audio/spaceAdventure/space.ogg");
		this.load.audio("explosionAudio", "/static/audio/spaceAdventure/explosion1.wav");
		this.load.audio("invincible", "/static/audio/spaceAdventure/invincible.ogg");

		// BOSS FIGHT ASSETS USED IN SCENE "BossBattle"
		this.load.image("bossAlien", "/static/images/spaceAdventure/simpleAlien.png"); // TODO: PLACEHOLDER IMAGE CHANGE LATER
		this.load.audio("bossMusic1", "/static/audio/spaceAdventure/boss1.ogg");
		this.load.audio("bossMusic", "/static/audio/spaceAdventure/boss2.ogg");
	}

	create() {
		this.loadingRectangle = this.add.rectangle(0, 300, 100, 100, {bgColor: "#FFF"});
		const loadingText = this.add.text(950, 300, "loading", {fontWeight: "bold", fontFamily: '"Lucida Console", Monaco, monospace', fontSize: "50px", align: "center", color: "#FF0000"});
		loadingText.setOrigin(loadingText.halfWidth, loadingText.halfHeight);
	}
	update() {
		const randIncrease = Phaser.Math.Between(10, 70);
		this.loadingRectangle.width += 20;
		if (this.loadingRectangle.width > this.game.canvas.width + 100){
			this.scene.start("main");
		}
	}
};