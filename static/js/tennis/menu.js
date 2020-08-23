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

export default class MenuScene extends Phaser.Scene {
	constructor() {
		super({key: "menu"});
	}

	preload() {
		this.load.image("logo", "/static/images/tennis/logo.png");
		this.load.image("singlePlayer", "/static/images/tennis/singlePlayer.png");
		this.load.image("multiPlayer", "/static/images/tennis/multiPlayer.png");
		this.load.image("playerPaddle", "/static/images/tennis/playerPaddle.png");
		this.load.image("compPaddle", "/static/images/tennis/compPaddle.png");
		this.load.image("ball", "/static/images/tennis/ball.png");
		this.load.image("player1Win", "/static/images/tennis/player1Win.png");
		this.load.image("player2Win", "/static/images/tennis/player2Win.png");
		this.load.image("winnerPopup", "/static/images/tennis/winnerPopup.png");
		this.load.image("loserPopup", "/static/images/tennis/loserPopup.png");
	}

	create() {
		const {scene} = this;
		this.add.image(500, 100, "logo").setScale(0.3);
		const singlePlayer = this.add.image(500, 300, "singlePlayer").setScale(0.3)
		const multiPlayer = this.add.image(500, 450, "multiPlayer").setScale(0.3);

		// resets all variables used in games so that it doesn't break the next game that is started, located in "globals.js"
		resetVars();

		multiPlayer.setInteractive();
		singlePlayer.setInteractive();

		singlePlayer.on("pointerup", () => {
			scene.start("singlePlayer");
		});

		multiPlayer.on("pointerup", () => {
			scene.start("multiPlayer");
		})

	}


}
