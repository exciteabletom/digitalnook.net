"use strict";
// all variables/functions needed across different classes and files are stored here
import {PlusHudText} from "./HudText.js";

export let g = { // g stands for 'global'
	gameScore: 0,
	gameTick: 0,
	aliensKilled: 0,
	playerLife: 4,
	bulletSpeed: 1200,
	enemyBulletSpeed: -500,
	simpleAlienWorth: 300,
	bossAlienWorth: 5000,
	boss: false, // true if boss battle is active
	bossLife: 2000,
	distanceToBoss: 60000, // when zero boss battle starts
	vel: 750,
	firingCooldown: 0,
	firingSpeed: 28, // bigger num is slower
	playerHit: () => {
		/** to be triggered when player is hit,
		 * removes one player life
		 * plays damage audio
		 * removes heart from hud
		 */
		g.playerLife--;
		g.Main.explosionAudio.play();
		const hearts = g.Main.hud.hearts.getChildren();
		const last = hearts[hearts.length -1];
		last.destroy();
		return g.playerLife;
	},
	addLife: (life=1) => {
		/** Adds to g.playerLife var
		 * adds heart image to hud
		 * for use with the heart powerup in game
		 */
		g.playerLife += life;
		const hearts = g.Main.hud.hearts.getChildren();
		const last = hearts[hearts.length -1];
		g.Main.hud.hearts.add(g.Main.add.image(last.x + 50, 60, "heart").setScale(0.3));
		return g.playerLife;
	},
	addScore: (score) => {
		/** adds to player score and adds graphics to the hud **/
		g.gameScore += score;
		const randY = Phaser.Math.Between(g.Main.hud.scoreText.y - 20, g.Main.hud.scoreText.y + 80);
		g.Main.hud.plusTexts.add(new PlusHudText({scene: g.Main, x: g.Main.hud.scoreText.x + 100, y: randY, text: `+${score}`}));
		return g.gameScore;
	}
};
function getObjCopy(obj) { // for whatever fucking reason objects saved to variables are essentially links instead of behaving like variables
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
	return [g, oldG];
}
export function getRandomInt(min, max = min + 1) {
	return Math.round(Math.random() * (max - min) + min); // gets a integer between max and min values and returns
}
