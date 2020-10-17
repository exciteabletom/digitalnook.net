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
 */
"use strict";
import Load from "../Load.js"
import Menu from "./Menu.js"
class Game extends Phaser.Game {
	constructor() {
		super(config);
		this.scene.add("load", Load);
		this.scene.add("menu", Menu);

		this.scene.start("load", {
			name: "dev",
			scene: "menu",
			items:
				`
				// All items to be preloaded			
				
				`
		});

	}
}

let config = {
	type: Phaser.AUTO,
	backgroundColor: "#20911b",
	scale: {
		parent: "game",
		mode: Phaser.Scale.FIT,
		width: 1900,
		height: 600,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: true,
		},
	},
	pixelArt: true,
};


new Game();
