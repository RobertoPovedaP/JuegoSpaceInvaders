document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const levelMessageElement = document.getElementById("levelMessage");

    const player = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 50,
        height: 20,
        color: "green",
        speed: 5
    };

    const bullets = [];
    let score = 0;
    let level = 1;
    let difficulty = 1;
    let invaderSpeed = 1;

    const invaders = [];

    function generateInvader() {
        const invader = {
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 20,
            color: "red",
            speed: invaderSpeed,
            alive: true
        };
        invaders.push(invader);
    }

    function drawPlayer() {
        ctx.beginPath();
        ctx.rect(player.x - player.width / 2, player.y, player.width, player.height);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.closePath();
    }

    function drawInvaders() {
        for (const invader of invaders) {
            if (invader.alive) {
                ctx.beginPath();
                ctx.rect(invader.x, invader.y, invader.width, invader.height);
                ctx.fillStyle = invader.color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    function drawBullets() {
        for (const bullet of bullets) {
            ctx.beginPath();
            ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.closePath();
        }
    }

    function movePlayer(event) {
        if (event.type === "keydown" || event.type === "keyup") {
            // Mover con teclas de flecha
            if (event.key === "ArrowLeft" && player.x - player.width / 2 > 0) {
                player.x -= player.speed;
            } else if (event.key === "ArrowRight" && player.x + player.width / 2 < canvas.width) {
                player.x += player.speed;
            }
        } else if (event.type === "mousemove") {
            // Mover con movimiento del ratón
            player.x = event.clientX - canvas.getBoundingClientRect().left;
        }
    }

    function shoot(event) {
        if ((event.type === "keydown" && event.key === " ") || (event.type === "mousedown" && event.button === 0)) {
            // Disparar con barra espaciadora o botón izquierdo del ratón
            bullets.push({
                x: player.x,
                y: player.y - 10,
                width: 5,
                height: 10,
                speed: 5
            });
        }
    }

    function moveInvaders() {
        for (const invader of invaders) {
            if (invader.alive) {
                invader.y += invader.speed;

                // Cambiar de dirección si alcanzan los límites del canvas
                if (invader.y + invader.height > canvas.height) {
                    invader.alive = false;

                    // Mostrar mensaje si alguna nave llega a la parte inferior
                    if (invaders.every(inv => !inv.alive)) {
                        levelMessageElement.textContent = "Perdiste";
                        resetGame();
                    }
                }
            }
        }
    }

    function moveBullets() {
        for (const bullet of bullets) {
            bullet.y -= bullet.speed;
        }
    }

    function checkCollisions() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (const invader of invaders) {
                if (invader.alive) {
                    // Verificar colisión entre bala e invasor
                    if (
                        bullets[i].x < invader.x + invader.width &&
                        bullets[i].x + bullets[i].width > invader.x &&
                        bullets[i].y < invader.y + invader.height &&
                        bullets[i].y + bullets[i].height > invader.y
                    ) {
                        // Eliminar bala e indicar que el invasor está muerto
                        bullets.splice(i, 1);
                        invader.alive = false;

                        // Incrementar la puntuación
                        score += 25;

                        // Generar nuevas naves si no hay ninguna nave viva
                        if (invaders.every(inv => !inv.alive)) {
                            setTimeout(() => {
                                generateInvader();
                            }, 2000); // Pausa de 2 segundos antes de generar una nueva nave
                        }
                    }
                }
            }
        }

        // Mostrar mensaje al ganar el juego
        if (score === 1000) {
            levelMessageElement.textContent = "¡Ganaste el juego!";
            resetGame();
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 10, 20);
        ctx.fillText("Level: " + level, 10, 40);
    }

    function updateLevel() {
        if (score % 300 === 0 && score !== 0) {
            level++;
            invaderSpeed += 0.5;
            difficulty += 0.05;
            levelMessageElement.innerHTML = "Score: " + score + " Nivel: " + level;
            setTimeout(() => {
                levelMessageElement.innerHTML = "";
            }, 2000); // Mostrar el mensaje del nivel durante 2 segundos
        }
    }

    function resetGame() {
        score = 0;
        level = 1;
        difficulty = 1;
        invaderSpeed = 1;
        invaders.length = 0;
        generateInvader();
        generateInvader();
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawBullets();
        drawInvaders();
        drawScore();

        moveInvaders();
        moveBullets();

        checkCollisions();
        updateLevel();

        requestAnimationFrame(gameLoop);
    }

    // Generar primer grupo de naves al iniciar el juego
    generateInvader();
    generateInvader();

    // Iniciar el bucle del juego
    gameLoop();

    // Agregar eventos para el movimiento del jugador
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", movePlayer);
    document.addEventListener("mousemove", movePlayer);

    // Agregar eventos para el disparo del jugador
    document.addEventListener("keydown", shoot);
    document.addEventListener("mousedown", shoot);
});