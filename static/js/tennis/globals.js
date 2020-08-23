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
