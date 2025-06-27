const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.85;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ボールの状態
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 3,
  radius: 15,
  vx: 2, // 横の速度
  vy: 0, // 縦の速度
  gravity: 0.4,
  bounce: -0.7,
};

function updateBall() {
  ball.vy += ball.gravity;        // 重力
  ball.x += ball.vx;
  ball.y += ball.vy;

  // 横の壁で反射
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.vx *= -1;
  }

  // 下の床でバウンド
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy *= ball.bounce;

    // 小さくなったら止める（跳ねすぎ防止）
    if (Math.abs(ball.vy) < 1) ball.vy = 0;
  }

  // 上の壁も反射
  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff99cc'; // 地雷ピンク
  ctx.fill();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBall();
  drawBall();

  requestAnimationFrame(gameLoop);
}
gameLoop();
