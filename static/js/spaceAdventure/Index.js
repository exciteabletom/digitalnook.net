/**
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Thomas C. Dougiamas
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */
import Main from "./Main.js";
import BossBattle from "./BossBattle.js";
import EndCard from "./EndCard.js";
import Load from "../Load.js";
class Game extends Phaser.Game {
	constructor() {
		super(config); // equivalent to Phaser.Game(config)

		this.scene.add("load", Load);
		this.scene.add("main", Main);
		this.scene.add("bossBattle", BossBattle);
		this.scene.add("endCard", EndCard);

		this.scene.start("load", {
			name: "Doctor 🅱️",
			scene: "main",
			items: `
				// GAME ASSETS
				this.load.spritesheet("ship",
					"/static/images/spaceAdventure/sheet/shipSheet.png",
					{frameWidth: 52, frameHeight: 30,}
				);


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
			`
		});
	}
}

let config = {
	type: Phaser.AUTO,
	backgroundColor: "#000",
	scale: {
		parent: "game",
		mode: Phaser.Scale.FIT,
		width: 1900,
		height: 600,
	},
	physics: {
		default: "arcade",
		arcade: {
			//debug: true,
		},
	},
	fps: {
		target: 60,
		min: 50
	},
	pixelArt: true,
};
new Game(); // init game

