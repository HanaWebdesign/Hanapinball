const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 画面サイズ調整
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.85;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// スコア
let score = 0;

// ボールの状態
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 3,
  radius: 15,
  vx: 2,
  vy: 0,
  gravity: 0.4,
  bounce: -0.7,
};

// バンパー3個
const bumpers = [
  { x: canvas.width * 0.3, y: canvas.height * 0.4, radius: 25 },
  { x: canvas.width * 0.7, y: canvas.height * 0.4, radius: 25 },
  { x: canvas.width * 0.5, y: canvas.height * 0.6, radius: 25 },
];

// ボール更新処理
function updateBall() {
  ball.vy += ball.gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;

  // 壁反射
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.vx *= -1;
  }

  if (ball.y - ball.radius < 0) {
    ball.vy *= -1;
  }

  // 床バウンド
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy *= ball.bounce;
    if (Math.abs(ball.vy) < 1) ball.vy = 0;
  }
}

// バンパーと接触したら跳ね返して得点
function checkBumperCollision() {
  bumpers.forEach((bumper) => {
    const dx = ball.x - bumper.x;
    const dy = ball.y - bumper.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + bumper.radius) {
      const angle = Math.atan2(dy, dx);
      ball.vx = Math.cos(angle) * 5;
      ball.vy = Math.sin(angle) * 5;
      score += 100;
    }
  });
}

// ボールを描画
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff99cc';
  ctx.fill();
}

// バンパー描画
function drawBumper() {
  bumpers.forEach((bumper) => {
    ctx.beginPath();
    ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff66cc';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// スコア表示
function drawScore() {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Yu Gothic';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// メインループ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBall();
  checkBumperCollision();
  drawBumper();
  drawBall();
  drawScore();

  requestAnimationFrame(gameLoop);
}

gameLoop();


// 左右タップでボールを上に打ち返す
document.getElementById('leftTouch').addEventListener('touchstart', () => {
  ball.vy = -7;
  ball.vx = -3;
});

document.getElementById('rightTouch').addEventListener('touchstart', () => {
  ball.vy = -7;
  ball.vx = 3;
});

// キーボード操作（PC用）
// Aキーで左、Dキーで右に打ち返す
document.addEventListener('keydown', (e) => {
  if (e.key === 'a' || e.key === 'A') {
    ball.vy = -7;
    ball.vx = -3;
  }
  if (e.key === 'd' || e.key === 'D') {
    ball.vy = -7;
    ball.vx = 3;
  }
});

// タップ操作（スマホ用）
document.getElementById('leftTouch').addEventListener('touchstart', () => {
  ball.vy = -7;
  ball.vx = -3;
});

document.getElementById('rightTouch').addEventListener('touchstart', () => {
  ball.vy = -7;
  ball.vx = 3;
});
