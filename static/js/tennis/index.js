import "/static/js/phaser.min.js";
import config from "./config.js";
import SinglePlayerScene from "./singlePlayer.js";
import winnerScene from "./winner.js"

// Game class for switching between scenes
class Game extends Phaser.Game {
    constructor () {
        super(config); // equiv to Phaser.Game(config);
        this.scene.add("singlePlayer", SinglePlayerScene);
        this.scene.add("winner", winnerScene);
        // TODO: loser scene
        // this.scene.add("loser", loserScene);
        this.scene.start("singlePlayer");
    }
}

window.game = new Game();