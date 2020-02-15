window.addEventListener("load", () => {
	const gameCanvas = document.getElementsByTagName("CANVAS")[0];  // get game canvas
	window.addEventListener("resize", () => { // when window resizes overrule dodgy ass phaser scaling
		gameCanvas.style.width = "100%";
		gameCanvas.style.height = "100%";
	});
});
