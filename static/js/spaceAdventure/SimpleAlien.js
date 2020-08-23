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

import { g } from "./Global.js";
import EnemyBullet from "./EnemyBullet.js";

export default class SimpleAlien extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "simpleAlien");
		this.config = config;
		this.firingSpeed = Phaser.Math.Between(65, 75);
		this.internalTick = this.firingSpeed - Phaser.Math.Between(0, 30);
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.setScale(0.8);
		this.setDepth(100); // bullets were going underneath aliens
		let velY = Phaser.Math.Between(200, 600);
		if (Math.random() < 0.5) {
			velY = velY * -1
		}
		this.setVelocityY(velY);
		this.setVelocityX(-400);
		this.setCollideWorldBounds(true);
		this.setBounce(1);

	}

	update() {
		const {config, body} = this;
		this.internalTick++;

		if (this.internalTick % this.firingSpeed === 0 && Math.random() < 0.70) {
			g.Main.sprites.enemyBullets.add(new EnemyBullet({
				scene: config.scene,
				x: body.x - body.halfWidth,
				y: body.y + body.halfHeight
			}));
		}
	}
}
