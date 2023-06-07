const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let playerPosition = 200;
let opponentPosition = 200;
let ball = { x: 395, y: 195, dx: 2, dy: 2 };

// Função para atualizar a posição da bola
function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisão com as bordas verticais
    if (ball.y < 0 || ball.y > 390) {
        ball.dy *= -1;
    }

    // Colisão com as raquetes
    if (ball.x <= 20 && ball.y >= playerPosition && ball.y <= playerPosition + 80) {
        ball.dx *= -1;
    }

    if (ball.x >= 770 && ball.y >= opponentPosition && ball.y <= opponentPosition + 80) {
        ball.dx *= -1;
    }

    // Verificar se a bola saiu da tela
    if (ball.x < 0 || ball.x > 800) {
        ball = { x: 395, y: 195, dx: 2, dy: 2 }; // Reiniciar a bola no centro
    }
}

// Função para enviar o estado do jogo para os clientes
function sendGameState() {
    const gameState = {
        playerPosition: playerPosition,
        opponentPosition: opponentPosition,
        ball: ball
    };

    wss.clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(gameState));
        }
    });
}

// Evento de conexão com um novo cliente
wss.on('connection', function(socket) {
    console.log('Novo cliente conectado');

    // Evento de recebimento de mensagens do cliente
    socket.on('message', function(message) {
        const data = JSON.parse(message);

        if (data.type === 'playerPosition') {
            playerPosition = data.position;
        }
    });

    // Evento de desconexão do cliente
    socket.on('close', function() {
        console.log('Cliente desconectado');
    });
});

// Loop principal do servidor
setInterval(function() {
    updateBallPosition();
    sendGameState();
}, 16);

console.log('WebSocket server listening on port 8080');