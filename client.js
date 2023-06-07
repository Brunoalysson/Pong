const pong = document.getElementById('pong');
const player = document.getElementById('player');
const opponent = document.getElementById('opponent');
const ball = document.getElementById('ball');

const socket = new WebSocket('ws://localhost:8080');

let playerPosition = 200;
let opponentPosition = 200;

// Adicionar os eventos para capturar as teclas pressionadas
const keys = {
    upPressed: false,
    downPressed: false
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        keys.upPressed = true;
    } else if (event.key === 'ArrowDown') {
        keys.downPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp') {
        keys.upPressed = false;
    } else if (event.key === 'ArrowDown') {
        keys.downPressed = false;
    }
});

// Função para atualizar a posição da raquete do jogador e enviar ao servidor
function update() {
    if (keys.upPressed) {
        playerPosition -= 5; // Mover para cima
    } else if (keys.downPressed) {
        playerPosition += 5; // Mover para baixo
    }

    const playerData = {
        type: 'playerPosition',
        position: playerPosition
    };
    socket.send(JSON.stringify(playerData));

    // Atualizar a posição da raquete do jogador no jogo
    player.style.top = playerPosition + 'px';

    requestAnimationFrame(update);
}

// Evento de recebimento de mensagens do servidor
socket.addEventListener('message', function(event) {
    const gameState = JSON.parse(event.data);

    // Atualizar a posição da bola
    ball.style.left = gameState.ball.x + 'px';
    ball.style.top = gameState.ball.y + 'px';

    // Atualizar a posição da raquete do oponente
    opponent.style.top = gameState.opponentPosition + 'px';
});

// Iniciar o loop do jogo
requestAnimationFrame(update);