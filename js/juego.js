document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencias a la nave y los invaders
    const ship = document.getElementById("ship");
    const invaders = document.querySelectorAll(".invader");

    // Variables para controlar el movimiento de la nave
    let shipPosition = 50;
    let isMovingLeft = false;
    let isMovingRight = false;

    // Manejar eventos de teclado para mover la nave
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            isMovingLeft = true;
        } else if (event.key === "ArrowRight") {
            isMovingRight = true;
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === "ArrowLeft") {
            isMovingLeft = false;
        } else if (event.key === "ArrowRight") {
            isMovingRight = false;
        }
    });

    // Función para mover la nave
    function moveShip() {
        if (isMovingLeft && shipPosition > 0) {
            shipPosition -= 5;
        }
        if (isMovingRight && shipPosition < 100) {
            shipPosition += 5;
        }
        ship.style.left = shipPosition + "%";
    }

    // Bucle principal del juego
    function gameLoop() {
        // Lógica del juego (por ejemplo, mover invaders, detectar colisiones)
        moveShip();
        requestAnimationFrame(gameLoop);
    }

    // Iniciar el bucle del juego
    gameLoop();
});
