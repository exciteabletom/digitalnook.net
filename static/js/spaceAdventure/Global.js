export let g = { // global vars
	gameScore: 0,
	gameTick: 0,
	aliensKilled: 0,
	playerLife: 3,
	bulletSpeed: 1000,
	enemyBulletSpeed: -500,
	Main: null,
	enemyBullets: null,
	simpleAlienWorth: 300
};
export function getRandomInt(min, max = min + 1) {
	return Math.round(Math.random() * (max - min) + min); // gets a integer between max and min values
}