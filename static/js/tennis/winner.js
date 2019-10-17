import "/static/js/phaser.min.js";
export default class WinnerScene extends Phaser.Scene() {
    constructor () {
        super("game");
    }

    preload () {
        this.load.image("winnerPopup", "/static/images/winnerPopup.png");
    }

    create () {
        let winnerPopup = this.add.image(0,0, "winnerPopup");
        this.input.setDefaultCursor("url(/static/images/cursors/tennis.cur), pointer");
        winnerPopup.setOrigin(0,0).setInteractive();
        winnerPopup.on("pointerup", function(pointer) {
            this.scene.start(singlePlayer)
        });
    }
};