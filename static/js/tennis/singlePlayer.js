import "/static/js/phaser.min.js"
export default class SinglePlayerScene extends Phaser.Scene {
    constructor () {
        super("game");
        this.gameState = {};
    }


    preload() {
        this.load.image("ball","/static/images/ball.png");
        this.load.image("playerPaddle", "/static/images/playerPaddle.png");
        this.load.image("compPaddle", "/static/images/compPaddle.png");
        this.load.image("winnerPopup", "/static/images/winnerPopup.png");
        this.load.image("loserPopup", "/static/images/loserPopup.png");
    };

    create() {
        let player = {
            score: 0,
        };

        let comp = {
            score: 0,
        };
        // Makes images using preloaded assets
        this.gameState.loserPopup = this.add.image(halfWidth, halfHeight, "loserPopup").setInteractive();
        this.gameState.winnerPopup = this.add.image(halfWidth, halfHeight, "winnerPopup").setInteractive();

        // Makes popups invisible so they can be used later
        this.gameState.loserPopup.setVisible(false);
        this.gameState.winnerPopup.setVisible(false);

        // Creates main game sprites, scales them, makes them interactive
        this.gameState.playerPaddle = this.physics.add.sprite(width20, halfHeight, "playerPaddle").setScale(0.3).setInteractive();
        this.gameState.compPaddle = this.physics.add.sprite((width - width20), halfHeight, "compPaddle").setScale(0.3).setInteractive();
        this.gameState.ball = this.physics.add.sprite(halfWidth, halfHeight, "ball").setScale(0.1).setInteractive();

        // player/ball collision
        this.physics.add.collider(this.gameState.playerPaddle, this.gameState.ball, function() {
            const randNum = Math.random(); // num between 0-1

            // slight randomness in velocity to make game feel more dynamic
            if(randNum <= 0.5){
                if (gameState.playerPaddle.body.velocity.y === 0) {
                    gameState.ball.setVelocityY(width10 * -1);
                } else {
                    gameState.ball.setVelocityY(gameState.playerPaddle.body.velocity.y / 1.9);
                }
            }else if (randNum >= 0.5){
                if (gameState.playerPaddle.body.velocity.y === 0) {
                    gameState.ball.setVelocityY(width10);
                } else {
                    gameState.ball.setVelocityY(gameState.playerPaddle.body.velocity.y / 1.7);
                }
            }
        });

        // comp/ball collision
        this.physics.add.collider(this.gameState.compPaddle, this.gameState.ball, function() {

            if (gameState.playerPaddle.y > halfHeight) {
                gameState.ball.setVelocityY((width10 * -1) * (Math.random() * 5));

            }else if (gameState.playerPaddle.y < halfHeight) {
                gameState.ball.setVelocityY(width10 * (Math.random() * 5));

            }else if (gameState.playerPaddle.y) {
                const num = Math.random(); // number between 0-1

                if (num >= 0.5) {
                    gameState.ball.setVelocityY(width10 *(Math.random() * 5));

                }else {
                    gameState.ball.setVelocityY((width10 * -1) *(Math.random() * 5));

                }
            }


        });

        // makes ball bounce during collisions
        this.gameState.ball.setBounce(1);
        // sets ball to go towards player on first boot
        this.gameState.ball.setVelocityX(-1000);

        // makes paddles unaffected by balls force
        this.gameState.playerPaddle.body.immovable = true;
        this.gameState.compPaddle.body.immovable = true;


        // creates default keyboard inputs
        this.gameState.cursors = this.input.keyboard.createCursorKeys();

        // ensures sprites never leave game
        this.gameState.compPaddle.setCollideWorldBounds(true);
        this.gameState.playerPaddle.setCollideWorldBounds(true);
        this.gameState.ball.setCollideWorldBounds(true);
    };
    update () {
        // TODO: why does this not scale when window is minimised then maximised?
        // anonymous func to set game size every update
        (function() {
            gameId = document.getElementById("game");
            gameId.style.width = '60%';
            gameId.style.height = '60%';
            gameId.style.marginRight = "5%";
        })();

        if (player.score < 10 && comp.score < 10){
            // TODO Mobile compatibility, How will multiplayer work?, swiping gestures or follow finger?
            // ...

            // desktop player controls
            if (gameState.cursors.down.isDown){
                gameState.playerPaddle.setVelocityY(800);
            }
            else if (gameState.cursors.up.isDown) {
                gameState.playerPaddle.setVelocityY(-800);
            }
            else {
                // if no keypress dont move
                gameState.playerPaddle.setVelocityY(0);
            }
            // resets ball if it goes off screen and assigns points to objects
            if (gameState.ball.x >= (width - width20)){
                player.score += 1;
                // resets ball
                gameState.ball.x = halfWidth;
                gameState.ball.y = halfHeight;
                gameState.ball.setVelocityY(0);
                gameState.ball.setVelocityX(width);
                // sets <p> elements to
                compScore.innerHTML = `Computer's score: ${comp.score}`;
                playerScore.innerHTML = `Your Score: ${player.score}`;
            }
            else if (gameState.ball.x <= width20) {
                comp.score += 1;
                //resets ball
                gameState.ball.x = halfWidth;
                gameState.ball.y = halfHeight;
                gameState.ball.setVelocityY(0);
                gameState.ball.setVelocityX(minusWidth);
                // sets results
                compScore.innerHTML = `Computer's score: ${comp.score}`;
                playerScore.innerHTML = `Your Score: ${player.score}`;
            }
            // computer paddle AI
            if (gameState.ball.x >= 300) {
                if (gameState.ball.y > (gameState.compPaddle.y + 50)) {
                    gameState.compPaddle.setVelocityY(450);
                }else if (gameState.ball.y < (gameState.compPaddle.y - 50)){
                    gameState.compPaddle.setVelocityY(-450);
                }
            }
        }
        else { // runs when game is over
            //sets result value
            // TODO: change this to be Phaser native
            playerScore.innerHTML = `Your score: ${player.score}`;
            compScore.innerHTML = `Computer's score: ${comp.score}`;

            //opens correct scene game invisible

            if (player.score === 10) {
                this.scene.start("winnerPopup");
            } else {
                // TODO: add loser scene
                this.scene.start("winnerPopup");
            }

        }

    };
};