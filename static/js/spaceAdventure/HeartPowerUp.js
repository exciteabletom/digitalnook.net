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

import {g} from "./Global.js";
export default class HeartPowerUp extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "heart");
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);

		this.spawnTick = g.gameTick;

		this.setCollideWorldBounds(true);
		this.setScale(0.3);
		this.setVelocityY(Phaser.Math.Between(-200, 200));
		this.setVelocityX(-500);
	}
	update() {
		if (g.gameTick % 200 === 0) {
			const randX = Phaser.Math.Between(-500, -200);
			const randY = Phaser.Math.Between(-200, 200);
			this.setVelocityX(randX);
			this.setVelocityY(randY);
		}
		if (g.gameTick === this.spawnTick + 2000) { // destroy after 2000 frames (roughly 30 seconds)
			this.destroy();
			g.powerUpActive = false;
		}
	}

}