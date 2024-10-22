import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let ballX = Math.random() * canvas.width;
let ballY = 0;

let score = 0;
let highScores = [];

document.addEventListener('mousemove', (e) => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
});

async function updateHighScores() {
    highScores = await backend.getHighScores();
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = score;
        highScoresList.appendChild(li);
    });
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function updateBallPosition() {
    ballY += 2;

    if (ballY + ballRadius > canvas.height - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            score++;
            document.getElementById('scoreValue').textContent = score;
            resetBall();
        } else if (ballY + ballRadius > canvas.height) {
            gameOver();
        }
    }
}

function resetBall() {
    ballX = Math.random() * canvas.width;
    ballY = 0;
}

async function gameOver() {
    await backend.addScore(score);
    await updateHighScores();
    alert(`Game Over! Your score: ${score}`);
    score = 0;
    document.getElementById('scoreValue').textContent = score;
    resetBall();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    updateBallPosition();
    requestAnimationFrame(draw);
}

updateHighScores();
draw();
