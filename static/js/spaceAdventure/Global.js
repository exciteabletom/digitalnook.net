// all variables/functions needed across different classes and files are stored here
export let g = { // g stands for 'global'
	gameScore: 0,
	gameTick: 0,
	aliensKilled: 0,
	playerLife: 3,
	bulletSpeed: 1000,
	enemyBulletSpeed: -500,
	simpleAlienWorth: 300,
	bossAlienWorth: 5000,
	boss: false, // true if boss battle is active
	bossLife: 2000,
	distanceToBoss: 20000, // when zero boss battle starts
	vel: 750,
	firingCooldown: 0,
	firingSpeed: 25,
	playerHit: () => {
		g.playerLife--;
		g.Main.explosionAudio.play();
		const hearts = g.Main.hud.hearts.getChildren();
		const last = hearts[hearts.length -1];
		last.destroy();
	}
};
export function getRandomInt(min, max = min + 1) {
	return Math.round(Math.random() * (max - min) + min); // gets a integer between max and min values
}