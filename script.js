const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 620;

let player, bullets, enemies, explosions, score, gameRunning;

// 🎵 Load Sound Effects
const explosionSound = new Audio("empty-gun-shot-6209.mp3"); // 🔫 Explosion Sound

// Player Object with Spaceship Emoji 🎮
class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height -10;
        this.speed = 20;
        this.emoji = "🎮"; // Spaceship Emoji
    }

    draw() {
        ctx.font = "30px Arial";
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

// Bullet Object (Blue & Round)
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5; // Bullet is now round
        this.speed = 7;
    }

    move() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Round shape
        ctx.fill();
    }
}

// Enemy Object 👹
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.speed = 0.5; // Slower speed
        this.emoji = "👹"; // Alien Emoji
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        ctx.font = "30px Arial";
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

// Explosion Object 💥
class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.timer = 4; // Time to disappear
    }

    draw() {
        ctx.font = "30px Arial";
        ctx.fillText("💥", this.x, this.y);
        this.timer--;
    }
}

// Function to Spawn New Enemies
function spawnEnemies() {
    for (let i = 0; i < 6; i++) {
        let x = Math.random() * (canvas.width - 40);
        let y = 0; // Start above the screen
        enemies.push(new Enemy(x, y));
    }
}


let gamePaused = false;
let animationFrameId; // Store animation frame for resuming

// Pause Game Function
function pauseGame() {
    gamePaused = true;
    cancelAnimationFrame(animationFrameId);
    ctx.fillStyle = "yellow"; 
    ctx.font = "30px Arial";
    ctx.fillText("Game Paused", canvas.width / 2 - 80, canvas.height / 2);
}

// Resume Game Function
function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        animate(); // Restart animation loop
    }
}

// Game Initialization
function initGame() {
    player = new Player();
    bullets = [];
    enemies = [];
    explosions = [];
    score = 0;
    gameRunning = true;
    document.getElementById("gameOverScreen").style.display = "none";

    // Initial set of enemies
    spawnEnemies();

    // Spawn new enemies every 4 seconds
    setInterval(spawnEnemies, 4000);

    animate();
}

// Game Loop
function animate() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    // Draw and move bullets
    bullets.forEach((bullet, index) => {
        bullet.move();
        bullet.draw();

        // Remove bullets that go off-screen
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Move and draw enemies
    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.draw();

        // Check if enemy reaches bottom
        if (enemy.y > canvas.height - 50) {
            endGame();
        }

        // Check for collision with bullets
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x - bullet.radius < enemy.x + enemy.width &&
                bullet.x + bullet.radius > enemy.x &&
                bullet.y - bullet.radius < enemy.y + enemy.height &&
                bullet.y + bullet.radius > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(index, 1);
                explosions.push(new Explosion(enemy.x, enemy.y)); // 💥 Explosion Effect
                explosionSound.play(); // 🔥 Play explosion sound
                score += 10;
            }
        });
    });

    // Draw explosions
    explosions.forEach((explosion, index) => {
        explosion.draw();
        if (explosion.timer <= 0) {
            explosions.splice(index, 1);
        }
    });

    // Display Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    animationFrameId = requestAnimationFrame(animate);
}

// Key Controls
let canShoot = true;
document.addEventListener("keydown", (event) => {
    if (event.key === "p" || event.key === "P") pauseGame();

    else if (event.key === "r" || event.key === "R") resumeGame();

    else if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key === "ArrowRight" && player.x + player.width < canvas.width) {
        player.x += player.speed;
    } else if (event.key === " " && canShoot) {
        bullets.push(new Bullet(player.x + player.width / 2, player.y));
        canShoot = false;
        setTimeout(() => canShoot = true, 300);
    }
});

// Game Over
function endGame() {
    gameRunning = false;
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverScreen").style.display = "block";
}

// Restart Game
function restartGame() {
    initGame();
}

// Start the Game
function startGame() {
    document.getElementById("startScreen").style.display = "none"; // Hide start screen
    document.getElementById("gameContainer").style.display = "block"; // Show game
    initGame(); // Start game logic
}

function exitGame() {
    document.getElementById("gameContainer").style.display = "none"; // Hide game
    document.getElementById("startScreen").style.display = "flex"; // Show start screen
}


