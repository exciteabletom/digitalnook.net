export class HudText extends Phaser.GameObjects.Text {
	constructor(config) {
		super(config.scene, config.x, config.y, config.text, {fontFamily: '"Lucida Console", Monaco, monospace', fontSize: "30px", align: "center"});
		config.scene.add.existing(this);
	}
}

export class PlusHudText extends Phaser.GameObjects.Text {
	constructor(config) {
		super(config.scene, config.x, config.y, config.text, {fontFamily: '"Lucida Console", Monaco, monospace', fontSize: "20px", align: "center", color: "#00FF00"});
		config.scene.add.existing(this);
		this.killMyself = 0;
	}

	update(){
		this.killMyself++;
		if (this.killMyself === 100){
			this.destroy();
		}
	}
}