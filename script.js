const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 620;

let player, bullets, enemies, explosions, score, gameRunning;
let gamePaused = false;
let animationFrameId;
let enemySpawnInterval;

// 🎵 Load Sound Effects
const explosionSound = new Audio("empty-gun-shot-6209.mp3");

// Player Object 🎮
class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height;
        this.speed = 20;
        this.emoji = "🎮";
    }

    draw() {
        ctx.font = "30px Arial";
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

// Bullet Object
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 7;
    }

    move() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
        this.speed = 0.5;
        this.emoji = "👹";
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
        this.timer = 4;
    }

    draw() {
        ctx.font = "30px Arial";
        ctx.fillText("💥", this.x, this.y);
        this.timer--;
    }
}

function spawnEnemies() {
    for (let i = 0; i < 6; i++) {
        let x = Math.random() * (canvas.width - 40);
        enemies.push(new Enemy(x, 0));
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
    gamePaused = false;
    document.getElementById("gameOverScreen").style.display = "none";

    clearInterval(enemySpawnInterval); // Ensure no duplicate intervals
    enemySpawnInterval = setInterval(spawnEnemies, 4000);
    spawnEnemies();

    animate();
}

// Game Loop
function animate() {
    if (!gameRunning || gamePaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    bullets.forEach((bullet, index) => {
        bullet.move();
        bullet.draw();
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.draw();

        if (enemy.y + enemy.height >= canvas.height + 30) {
            endGame();
        }        

        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x - bullet.radius < enemy.x + enemy.width &&
                bullet.x + bullet.radius > enemy.x &&
                bullet.y - bullet.radius < enemy.y + enemy.height &&
                bullet.y + bullet.radius > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(index, 1);
                explosions.push(new Explosion(enemy.x, enemy.y));
                explosionSound.play();
                score += 10;
            }
        });
    });

    explosions.forEach((explosion, index) => {
        explosion.draw();
        if (explosion.timer <= 0) explosions.splice(index, 1);
    });

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    animationFrameId = requestAnimationFrame(animate);
}

// Pause Game
function pauseGame() {
    gamePaused = true;
    cancelAnimationFrame(animationFrameId);
    ctx.fillStyle = "yellow";
    ctx.font = "30px Arial";
    ctx.fillText("Game Paused", canvas.width / 2 - 80, canvas.height / 2);
}

// Resume Game
function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        animate();
    }
}

// Game Over
function endGame() {
    gameRunning = false;
    clearInterval(enemySpawnInterval);
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverScreen").style.display = "block";
}

// Key Controls
let canShoot = true;
document.addEventListener("keydown", (event) => {
    if (event.key === "p" || event.key === "P") pauseGame();
    else if (event.key === "r" || event.key === "R") resumeGame();
    else if (event.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    else if (event.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
    else if (event.key === " " && canShoot) {
        bullets.push(new Bullet(player.x + player.width / 2, player.y));
        canShoot = false;
        setTimeout(() => canShoot = true, 300);
    }
});

// Start Game
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initGame();
}

// Restart Game
function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    initGame();
}

// Exit Game
function exitGame() {
    clearInterval(enemySpawnInterval);
    cancelAnimationFrame(animationFrameId);
    gameRunning = false;
    gamePaused = false;
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
}
