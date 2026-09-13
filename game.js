const jumpSound = document.getElementById("jumpSound");
const gameOverSound = document.getElementById("gameOverSound");

const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");


// =========================
// GAME SETTINGS
// =========================

let playerY = 250;
let velocity = 0;

let gravity = 0.5;
let jumpPower = -8;

let pipes = [];
let score = 0;

let gameRunning = true;


// =========================
// JUMP
// =========================

function jump() {

    if (!gameRunning) return;

    velocity = jumpPower;

    jumpSound.currentTime = 0;

    jumpSound.play().catch(() => {});

}


// =========================
// SPACE KEY
// =========================

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();

        jump();

    }

});


// =========================
// MOUSE CLICK
// =========================

document.addEventListener("click", function(event) {

    // Don't jump when clicking PLAY AGAIN
    if (event.target.tagName === "BUTTON") return;

    jump();

});


// =========================
// CREATE FRIEND WALLS
// =========================

function createPipe() {

    const game = document.getElementById("game");


    // Distance between top and bottom
    const gap = 180;


    // Random wall height
    const minHeight = 100;
    const maxHeight = 300;


    const topHeight =
        Math.floor(
            Math.random() * (maxHeight - minHeight)
        ) + minHeight;


    const bottomHeight =
        600 - topHeight - gap;


    // =========================
    // TOP FRIEND
    // =========================

    const topPipe = document.createElement("div");


    topPipe.style.position = "absolute";

    // ZOOMED SIZE
    topPipe.style.width = "110px";

    topPipe.style.height =
        topHeight + "px";


    // Friend image
    topPipe.style.backgroundImage =
        "url('assets/wall.png')";


    topPipe.style.backgroundSize =
        "100% 100%";


    topPipe.style.backgroundRepeat =
        "no-repeat";


    // Turn upside down
    topPipe.style.transform =
        "rotate(180deg)";


    topPipe.style.left =
        "400px";


    topPipe.style.top =
        "0px";


    topPipe.style.pointerEvents =
        "none";


    // =========================
    // BOTTOM FRIEND
    // =========================

    const bottomPipe =
        document.createElement("div");


    bottomPipe.style.position =
        "absolute";


    // ZOOMED SIZE
    bottomPipe.style.width =
        "110px";


    bottomPipe.style.height =
        bottomHeight + "px";


    // Friend image
    bottomPipe.style.backgroundImage =
        "url('assets/wall.png')";


    bottomPipe.style.backgroundSize =
        "100% 100%";


    bottomPipe.style.backgroundRepeat =
        "no-repeat";


    bottomPipe.style.left =
        "400px";


    bottomPipe.style.bottom =
        "0px";


    bottomPipe.style.pointerEvents =
        "none";


    // Add to game
    game.appendChild(topPipe);

    game.appendChild(bottomPipe);


    // Save pipe
    pipes.push({

        top: topPipe,

        bottom: bottomPipe,

        x: 400,

        passed: false

    });

}


// =========================
// GAME LOOP
// =========================

function gameLoop() {

    if (!gameRunning) return;


    // =========================
    // GRAVITY
    // =========================

    velocity += gravity;

    playerY += velocity;


    player.style.top =
        playerY + "px";


    // =========================
    // MOVE FRIENDS
    // =========================

    pipes.forEach(function(pipe) {


        // Speed
        pipe.x -= 3;


        pipe.top.style.left =
            pipe.x + "px";


        pipe.bottom.style.left =
            pipe.x + "px";


        // =========================
        // SCORE
        // =========================

        if (
            !pipe.passed &&
            pipe.x < 80
        ) {

            pipe.passed = true;

            score++;

            scoreText.textContent =
                score;

        }


        // =========================
        // PLAYER HITBOX
        // =========================

        const playerLeft = 88;

        const playerRight = 122;

        const playerTop =
            playerY + 8;

        const playerBottom =
            playerY + 42;


        // =========================
        // FRIEND HITBOX
        // =========================

        // Image is 110px wide.
        // Only center part is dangerous.

        const pipeLeft =
            pipe.x + 30;

        const pipeRight =
            pipe.x + 80;


        // =========================
        // CHECK HORIZONTAL HIT
        // =========================

        const touchingWall =

            playerRight > pipeLeft &&

            playerLeft < pipeRight;


        // =========================
        // CHECK TOP WALL
        // =========================

        const touchingTop =

            playerTop <
            pipe.top.offsetHeight;


        // =========================
        // CHECK BOTTOM WALL
        // =========================

        const touchingBottom =

            playerBottom >
            600 - pipe.bottom.offsetHeight;


        // =========================
        // COLLISION
        // =========================

        if (

            touchingWall &&

            (
                touchingTop ||
                touchingBottom
            )

        ) {

            endGame();

        }


        // =========================
        // REMOVE OLD FRIENDS
        // =========================

        if (pipe.x < -130) {

            pipe.top.remove();

            pipe.bottom.remove();

        }

    });


    // =========================
    // CEILING
    // =========================

    if (playerY < 0) {

        endGame();

    }


    // =========================
    // GROUND
    // =========================

    if (playerY > 550) {

        endGame();

    }


    // Continue game
    requestAnimationFrame(gameLoop);

}


// =========================
// GAME OVER
// =========================

function endGame() {

    // Prevent duplicate game over
    if (!gameRunning) return;


    gameRunning = false;


    // Game over sound
    gameOverSound.currentTime = 0;

    gameOverSound.play().catch(() => {});


    // Final score
    finalScore.textContent =
        "Score: " + score;


    // Show game over screen
    gameOverScreen.style.display =
        "block";

}


// =========================
// RESTART GAME
// =========================

function restartGame() {

    location.reload();

}


// =========================
// CREATE FRIEND EVERY 1.8 SEC
// =========================

setInterval(function() {

    if (gameRunning) {

        createPipe();

    }

}, 1800);


// =========================
// START GAME
// =========================

gameLoop();