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
		paths.push("newPath");


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
					if (current === "newPath") { // newPath says if the user released the mouse
						newPath = true;
						continue;
					}

					if (newPath) {
						context.moveTo(current.x, current.y);
						newPath = false;
						continue;
					}

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