export default class Background extends Phaser.GameObjects.TileSprite {
	constructor(config) {
		super(config.scene, config.x, config.y, config.width, config.height, config.key).setOrigin(0);
		config.scene.add.existing(this);

	}
	updateBackground(scrollSpeed = 5) {
		this.tilePositionX += scrollSpeed;
	}
}
