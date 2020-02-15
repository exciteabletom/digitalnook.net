const red = "red";
const green = "green";

let sprites = {};
let cursors = undefined;

// objects for storing scores TODO: use this to store other things, maybe singlePlayer gauntlet using persistent score.
let player1 = {score: 0};
let player2 = {score: 0};

// default styling for text elements
let textConfig = {
	fontFamily: "impact",
	fontSize: "50px",
	fontWeight: "bold",
	color: red,
};

// object for storing text values

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
	player1.score = 0;
	player2.score = 0;

	cursors = {};
	sprites = {};
}

let keyW, keyS, keyDown, keyUp;
