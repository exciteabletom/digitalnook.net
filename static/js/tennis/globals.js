let sprites = {};
let player = {score: 0, winner: false};
let comp = {score: 0, winner: false};
let cursors = undefined;

// DOM aliases
const playerScore = document.getElementById("playerScore");
const compScore = document.getElementById("compScore");

function getRandomInt(min, max = min + 1) {
	return Math.round(Math.random() * (max - min) + min); // gets a integer between max and min values
}
function getRandomFloat(min, max = min + 1) {
	return Math.random() * (max - min) + min; // gets a float between max and min values
}
function getRandomBool() {
	return Math.random() < 0.5; // returns true if condition is met false otherwise
}
function resetVars() {
	// reset Variables
	player.score = 0;
	comp.score = 0;
	cursors = {};
	sprites = {};
}
