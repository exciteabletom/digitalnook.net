"use strict";

const playerToken = getRandomToken();

function getRandomToken() {
	let token = "";
	while (token.length < 20) {
		token += Math.random().toString(36).substr(2, 5);
	}

	return token;
}