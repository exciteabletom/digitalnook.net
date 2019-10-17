import "/static/js/phaser.min.js";

let config;
export default class config {
    type: Phaser.AUTO,
    scale: {
        parent: "game",
        mode: Phaser.Scale.FIT,
        width: 1000,
        height: 600,

    },
    backgroundColor: 0xbfbfbf,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: true,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};
