"use strict";
// all variables/functions needed across different classes and files are stored here
import {PlusHudText} from "./HudText.js";

let tempNewScore = 0;
export let g = { // g stands for 'global'
	gameScore: 0,
	highScore: window.highScore,
	username: window.username,
	gameTick: 0,
	gameResult: null,
	cookieTimeout: 2000,

	aliensKilled: 0,
	playerLife: 3,

	simpleAlienWorth: 300,
	alienSpawnRate: 180,// lower is quicker
	bossAlienWorth: 5000,
	boss: false, // true if boss battle is active
	bossLife: 2000,
	distanceToBoss: 34000, // when <0 boss battle starts

	shipVel: 750,
	firingCooldown: 0,
	firingSpeed: 28, // bigger num is slower
	bulletSpeed: 1200,
	playerHit: () => {
		/** to be triggered when player is hit,
		 * removes one player life
		 * plays damage audio
		 * removes heart from hud
		 */
		if (g.playerLife > 0) {
			g.playerLife--;
			g.Main.playerHitAudio.play();
			const hearts = g.Main.hud.hearts.getChildren();
			const last = hearts[hearts.length -1];
			last.destroy();
		}
		return g.playerLife;
	},
	addLife: (life=1) => {
		/** Adds to g.playerLife var
		 * adds heart image to hud
		 * for use with the heart powerup in game
		 */
		if (g.playerLife > 0) {
			g.playerLife += life;
			const hearts = g.Main.hud.hearts.getChildren();
			const last = hearts[hearts.length -1];
			if (last) {
				g.Main.hud.hearts.add(g.Main.add.image(last.x + 50, 60, "heart").setScale(0.3));
			}
		}

		return g.playerLife;
	},
	addScore: (score) => {
		/** adds to player score and adds graphics to the hud **/
		g.gameScore += score;
		try { // Only works if g.Main is active
			const randY = Phaser.Math.Between(g.Main.hud.scoreText.y - 20, g.Main.hud.scoreText.y + 80);
			g.Main.hud.plusTexts.add(new PlusHudText({scene: g.Main, x: g.Main.hud.scoreText.x + 100, y: randY, text: `+${score}`}));
		} catch (TypeError) {
			console.log(`EXPECTED ERROR in g.addScore \n`, TypeError); // catches errors that occur if g.main has ended
		}
		return g.gameScore;
	},
	getRandTrack (scene) {
		let audio = "";

		if (!scene) {
			throw new TypeError("g.selectRandTrack >> scene is undefined")
		}

		scene = scene.toLowerCase();
		let rand = -100;
		if (scene === "main") {
			rand = Phaser.Math.Between(0, 2);
		} else if (scene === "boss") {
			rand = Phaser.Math.Between(0, 2);
		} else {
			throw new TypeError(`The scene: '${scene}' is not supported by g.getRandTrack`)
		}

		audio = scene + rand.toString();

		return audio;
	},
	updateScore (score) {
		let formData = new FormData();
		formData.append("score", score.toString());

		const postID = g.getCookie("postID");
		formData.append("postID", postID);

		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/games/doctorb/");
		xhr.send(formData);

		xhr.onload = () => {
			tempNewScore = xhr.responseText;
			console.log(xhr.responseText);
		}
	},
	updatePostID () {
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/getPostID/");
		xhr.send();

		xhr.onload = () => {
			const newPostID = xhr.responseText;
			document.cookie = `postID=${newPostID}; max-age=${g.cookieTimeout}`;
		}
	},
	getAllCookies() {
		const cookies = document.cookie.split("; ");
		const cookieObj = {};

		console.log(cookies);

		for (let i = 0; i< cookies.length; i++) {
			let nameAndValue = cookies[i].split("=");
			nameAndValue = nameAndValue.filter(item => item !== "");

			console.log(nameAndValue);
			cookieObj[nameAndValue[0]] = nameAndValue[1];
		}
		console.log(cookieObj);
		return cookieObj

	},
	getCookie(name) {
		const all = g.getAllCookies();

		if (all[name]) {
			return all[name]
		} else {
			throw TypeError(`Cookie '${name}' does not exist`)
		}

	}

};

setInterval(() => {
	g.updatePostID();
}, 2000);

function getObjCopy(obj) { // for whatever fucking reason objects saved to variables are essentially symlinks instead of behaving like variables
	let newObj = {};
	for (let key in obj){
		newObj[key] = obj[key];
	}
	return Object.freeze(newObj);
}
const oldG = getObjCopy(g); // oldG allows the g object to be reset to defaults when the game has restarted

export function resetGlobals() {
	g = {};
	for (let key in oldG){
		g[key] = oldG[key]
	}

	g.highScore = tempNewScore;

	return g;
}
export function getRandomInt(min, max = min + 1) {
	return Math.round(Math.random() * (max - min) + min); // gets a integer between max and min values and returns
}
