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
"use strict";
const canvas = document.getElementById("newDrawing");
const context = canvas.getContext("2d");
let paths = [];

// Configuration object that can be changed by user \/TODO/\
let config = {
	width: 5,
	color: "#000000",
};

try {
	canvas.addEventListener("mousedown", event => startDrawing(event));
	canvas.addEventListener("mouseup", stopDrawing);
	canvas.addEventListener("mousemove", event => draw(event));
	document.addEventListener("mouseup", stopDrawing)
	let isDrawing = false;

// MOUSE EVENTS
	function startDrawing(event) {
		isDrawing = true;

		let pos = {
			x: (event.pageX - rect.left - scrollX),
			y: (event.pageY - rect.top - scrollY),
			color: config.color,
			width: config.width
		};
		paths.push(pos);

		setTimeout(() => {
			draw(event);
		}, 10);
	}

	function stopDrawing() {
		isDrawing = false;
		paths = [];

	}


	function draw(event, mode = "draw") {
		if (isDrawing && mode === "draw") {

			const rect = canvas.getBoundingClientRect();
			/**
			 * coordinates are determined by taking the position of the mouse from the edge of the screen
			 * and deducting it from the page width/length
			 * Then taking into account for scrolling on the page with scroll{X/Y}
			 **/
			let pos = {
				x: (event.pageX - rect.left - scrollX),
				y: (event.pageY - rect.top - scrollY),
				color: config.color,
				width: config.width
			};

			paths.push(pos);
			let newPath = false;

			context.beginPath();
			for (let i = 0; i <= paths.length; i++) {
				try {
					const current = paths[i];
					/*if (current === "newPath") { // newPath says if the user released the mouse
						newPath = true;
						continue;
					}*/

					/*if (newPath) {
						context.moveTo(current.x, current.y);
						newPath = false;
						continue;
					}*/

					context.strokeStyle = current.color;
					context.lineWidth = current.width;
					context.lineCap = "round";

					const last = paths[i - 1];
					context.beginPath();
					context.moveTo(last.x, last.y);


					context.lineTo(current.x, current.y);
					context.stroke();
				} catch (e) {
					// helps with "last is undefined"
					//console.log(e);
				}
			}
		} else if (isDrawing && mode === "erase") {
			for (let i = 0; i <= paths.length; i++) {
				try {
					const current = paths[i];
				} catch (e) {
					console.log(e);
				}
			}
		}


	}
} catch (e) {
	console.log(e);
}

function clearCanvasAndPaths() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	paths = [];
}

function changeWidth(width) {
	config.width = width;
}

// from stack overflow and it's fucking black magic
function invertHex(inputHex) {
	let hex = inputHex.substring(1);
	return `#${(Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()}`
}
// end stack overflow

document.getElementById(config.color).style.border = `2px solid ${invertHex(config.color)}`; // default border

function changeColor(color) {
	const old = document.getElementById(config.color);
	old.style.border = "none";

	config.color = color;
	document.getElementById(config.color).style.border = `2px solid ${invertHex(config.color)}`;
}
