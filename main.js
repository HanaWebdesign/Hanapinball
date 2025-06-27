// canvas とコンテキストの取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const launchBtn = document.getElementById('launchBtn');

// キャンバスサイズ
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.7;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let shots = 3;
let gameOver = false;
let effects = [];
let ballReady = true;

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 15,
  vx: 0,
  vy: 0,
  gravity: 0.4,
  bounce: -0.7,
  launched: false
};

const bumpers = [
  { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 25, cooldown: 0 },
  { x: canvas.width * 0.5, y: canvas.height * 0.3, radius: 25, cooldown: 0 },
  { x: canvas.width * 0.8, y: canvas.height * 0.3, radius: 25, cooldown: 0 },
  { x: canvas.width * 0.3, y: canvas.height * 0.5, radius: 25, cooldown: 0 },
  { x: canvas.width * 0.7, y: canvas.height * 0.5, radius: 25, cooldown: 0 }
];

// 発射
launchBtn.addEventListener('click', () => {
  if (ballReady && shots > 0 && !gameOver) {
    ball.vx = 0;
    ball.vy = -10;
    ball.launched = true;
    ballReady = false;
    shots--;
  }
});

function updateBall() {
  if (!ball.launched) return;

  ball.vy += ball.gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.vx *= -1;
  }
  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
  }

  if (ball.y + ball.radius > canvas.height) {
    if (shots === 0) {
      gameOver = true;
    } else {
      resetBall();
    }
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.vx = 0;
  ball.vy = 0;
  ball.launched = false;
  ballReady = true;
}

function checkBumperCollision() {
  if (!ball.launched) return;

  bumpers.forEach((bumper) => {
    if (bumper.cooldown > 0) {
      bumper.cooldown--;
      return;
    }

    const dx = ball.x - bumper.x;
    const dy = ball.y - bumper.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + bumper.radius) {
      const angle = Math.atan2(dy, dx);
      const overlap = ball.radius + bumper.radius - distance;
      ball.x += Math.cos(angle) * overlap;
      ball.y += Math.sin(angle) * overlap;

      ball.vx = Math.cos(angle) * 5;
      ball.vy = Math.sin(angle) * 5;
      score += 100;

      effects.push({ x: bumper.x, y: bumper.y, radius: 0, alpha: 1.0 });
      bumper.cooldown = 15;
    }
  });
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff99cc';
  ctx.fill();
}

function drawBumper() {
  bumpers.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff66cc';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  });
}

function drawEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i];
    e.radius += 1;
    e.alpha -= 0.03;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${e.alpha})`;
    ctx.stroke();
    if (e.alpha <= 0) effects.splice(i, 1);
  }
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Yu Gothic';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Shots Left: ${shots}`, 10, 55);

  if (gameOver) {
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Yu Gothic';
    ctx.fillStyle = '#ff99cc';
    ctx.fillText('💔 GAME OVER 💔', canvas.width / 2, canvas.height / 2);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameOver) updateBall();
  checkBumperCollision();
  drawBumper();
  drawEffects();
  drawBall();
  drawScore();
  requestAnimationFrame(gameLoop);
}

gameLoop();