const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");
const gameWidth = gameArea.offsetWidth - 40;
const gameHeight = gameArea.offsetHeight - 40;
const snakeSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 140, y: 200 };
let obstacles = [];
let speed = 100;
let score = 0;

function createFood() {
  const foodElement = document.createElement("div");
  foodElement.style.left = `${food.x}px`;
  foodElement.style.top = `${food.y}px`;
  foodElement.classList.add("food");
  gameArea.appendChild(foodElement);
}

function createObstacle() {
  let obstacleX = Math.floor(Math.random() * (gameWidth / snakeSize)) *
    snakeSize;
  let obstacleY = Math.floor(Math.random() * (gameHeight / snakeSize)) *
    snakeSize;
  obstacles.push({ x: obstacleX, y: obstacleY });
}

function draw() {
  gameArea.innerHTML = "";
  createFood();
  drawObstacles();
  snake.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.left = `${segment.x}px`;
    snakeElement.style.top = `${segment.y}px`;
    snakeElement.classList.add("snake");
    gameArea.appendChild(snakeElement);
  });
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    const obstacleElement = document.createElement("div");
    obstacleElement.style.left = `${obstacle.x}px`;
    obstacleElement.style.top = `${obstacle.y}px`;
    obstacleElement.classList.add("obstacle");
    gameArea.appendChild(obstacleElement);
  });
}

function moveSnake() {
  for (let i = snake.length - 2; i >= 0; i--) {
    snake[i + 1] = { ...snake[i] };
  }
  snake[0].x += direction.x * snakeSize;
  snake[0].y += direction.y * snakeSize;
}

function randomFoodPosition() {
  let foodX = Math.floor(Math.random() * (gameWidth / snakeSize)) * snakeSize;
  let foodY = Math.floor(Math.random() * (gameHeight / snakeSize)) * snakeSize;
  food = { x: foodX, y: foodY };
}

function updateScore() {
  score += 10;
  scoreDisplay.innerText = `Score: ${score}`;
}

function checkCollision() {
  if (
    snake[0].x < 0 || // Left edge
    snake[0].x + snakeSize >= gameWidth || // Right edge, adjusted for effective playable area
    snake[0].y < 0 || // Top edge
    snake[0].y + snakeSize >= gameHeight // Bottom edge, adjusted for effective playable area
  ) {
    return true; // Collision with the game boundary
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true; // Self-collision detected
    }
  }

  for (let obstacle of obstacles) {
    if (snake[0].x === obstacle.x && snake[0].y === obstacle.y) {
      return true; // Obstacle collision detected
    }
  }

  return false; // No collision detected
}

//collision gpt helped but still not accurate

function update() {
  if (checkCollision()) {
    alert(`Game over! Your score: ${score}`);
    window.location.reload();
    return;
  }
  moveSnake();
  if (snake[0].x === food.x && snake[0].y === food.y) {
    snake.unshift({
      x: snake[0].x + direction.x * snakeSize,
      y: snake[0].y + direction.y * snakeSize,
    });
    randomFoodPosition();
    createObstacle();
    updateScore();
  }
  draw();
  setTimeout(update, speed);
}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

document.addEventListener("keydown", changeDirection);

function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: 0 };
  obstacles = [];
  score = 0;
  scoreDisplay.innerText = "Score: 0";
  randomFoodPosition();
  createObstacle();
  update();
}

restartButton.addEventListener("click", startGame);
startGame();
