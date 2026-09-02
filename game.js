const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

// Game variables
let birdY = 200;
let birdX = 50;
let velocity = 0;
let gravity = 0.4;
let jump = -7;
let score = 0;
let gameOVer = false;

// Pipe variables
let pipes = [];
let pipeWidth = 50;
let pipeGap = 120;
let pipeSpeed = 2;
let frameCount = 0;

// Listen for jump controls (Spacebar or Click/Tap)
document.addEventListener("keydown", (e) => { if (e.code === "Space") forceJump(); });
canvas.addEventListener("click", forceJump);

function forceJump() {
    if (gameOVer) {
        resetGame();
    } else {
        velocity = jump;
    }
}

function resetGame() {
    birdY = 200;
    velocity = 0;
    pipes = [];
    score = 0;
    scoreEl.innerText = score;
    gameOVer = false;
    loop();
}

function loop() {
    if (gameOVer) return;

    // Apply gravity
    velocity += gravity;
    birdY += velocity;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bird
    ctx.fillStyle = "#fbd000"; // Yellow bird
    ctx.fillRect(birdX, birdY, 20, 20);

    // Floor/Ceiling collision
    if (birdY + 20 > canvas.height || birdY < 0) {
        endGame();
    }

    // Handle Pipes
    frameCount++;
    if (frameCount % 100 === 0) {
        let topPipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 60)) + 30;
        pipes.push({ x: canvas.width, top: topPipeHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        // Draw top pipe
        ctx.fillStyle = "#73bf2e"; // Green pipe
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);

        // Draw bottom pipe
        let bottomY = pipes[i].top + pipeGap;
        ctx.fillRect(pipes[i].x, bottomY, pipeWidth, canvas.height - bottomY);

        // Score tracking
        if (pipes[i].x + pipeWidth === birdX) {
            score++;
            scoreEl.innerText = score;
        }

        // Collision detection
        if (
            birdX + 20 > pipes[i].x && 
            birdX < pipes[i].x + pipeWidth && 
            (birdY < pipes[i].top || birdY + 20 > bottomY)
        ) {
            endGame();
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    requestAnimationFrame(loop);
}

function endGame() {
    gameOVer = true;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.font = "16px Arial";
    ctx.fillText("Click or Press Space to Restart", canvas.width / 2, canvas.height / 2 + 40);
}

// Start game initially
resetGame();
