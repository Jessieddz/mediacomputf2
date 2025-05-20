// the design of the court was inspired by Declan Concannon's coding on openprocessing
let playerRacketImg, catImg, catRacketImg;

let angleSlider;


let ballX = 400, ballY = 500;
let direction = true;
let p = 0, k = 0, i = 25;
let score = 0;
let gameStarted = false;

let dragging = false;
let offsetX = 0, offsetY = 0;
let racketPos = { x: 100, y: 400 };

let catX = 1200;
let catY = 900;

function preload() {
  playerRacketImg = loadImage("img/tennisp.png");
  catImg = loadImage("img/19a88f5def820ccdd643b69cd0f6149.png");
  catRacketImg = loadImage("img/tennisp2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  angleMode(DEGREES);
  frameRate(60);

angleSlider = createSlider(-3, 3, 0, 0.1);
angleSlider.position(50, 800);
angleSlider.input(() => {
  k = angleSlider.value();
});


  let startBtn = createButton("Click to Start Serve");
  startBtn.position(30, 90);
  startBtn.mousePressed(() => {
    gameStarted = true;
    let racketCenterX = racketPos.x + 100;
    let racketHeadY = racketPos.y + 60;
    ballX = racketCenterX;
    ballY = racketHeadY;
    direction = true;
    score = 0;
    k = angleSlider.value();
    p = 0;
  });
}

function draw() {
     background(0, 60, 60);  
  
     push();
translate(30, -120); 
scale(2);        
drawCourt();       
pop();


  

  fill(0);
  textSize(40);
  text("Score: " + score, 20, 60);

  // 🟦 猫自动上下移动：让拍子蓝点对准球
  let targetCatY = ballY - (100 - 200); // 蓝点在拍子图像中的相对位置
  catY += (targetCatY - catY) * 0.1;

  // 玩家球拍
  image(playerRacketImg, racketPos.x + 10, racketPos.y - 20, 200, 320);

  // 猫与球拍
  image(catImg, catX -95, catY - 60, 300, 300);
  image(catRacketImg, catX-70 + 200, catY - 200, 200, 320);



  // 🟢 玩家拍头可视化
  fill(0, 100, 100);
  noStroke();
  circle(racketPos.x + 100, racketPos.y + 60, 10);

  // 🟦 猫球拍蓝点可视化
  fill(200, 80, 255);
  noStroke();
  circle(catX + 280, catY - 100, 10); // 蓝点位置

    if (gameStarted) {
    playRally();
  } else {
    textSize(50);
    fill(0,100,100);
    text("Click 'Start Serve' to begin", 500, 500);
    let racketCenterX = racketPos.x + 100;
    let racketHeadY = racketPos.y + 60;
    drawBall(racketCenterX, racketHeadY);
  }
}

function drawCourt() {

    
  // 球场背景
  push();
 

  // 白线和区域
  stroke(255);
  strokeWeight(2);
  fill(100, 40, 60);
  rect(35, 85, 730, 430);
  rect(50, 100, 700, 400);
  rect(50, 150, 700, 300);
  rect(200, 150, 400, 300);
  line(200, 300, 600, 300);
  pop();

  // 球网
  push();
  translate(350, 75);
  stroke(0);
  strokeWeight(1);
  noFill();
  let xMod = 0;
  let yMod = 0;
  let yCounter = 0;
  for (let netX = 0; netX < 51; netX += 5) {
    line(netX, 0 + xMod, netX, 454 - xMod);
    xMod += 4;
  }
  for (let netY = 0; netY < 450; netY += 5) {
    line(0, netY, abs(yMod) * 6 + 1, netY);
    yCounter++;
    if (yMod <= 7) yMod++;
    if (yCounter > 83) yMod -= 2;
  }
  stroke(100);
  strokeWeight(4);
  line(50, 40, 50, 410);
  stroke(100, 40, 40);
  strokeWeight(8);
  line(0, 0, 50, 40);
  line(0, 451, 50, 410);
  pop();
}


function playRally() {
  if (direction) {
    ballX += i;
    ballY += p + k;

    // 猫接球蓝点位置
    let catHitX = catX + 300;
    let catHitY = catY - 100;

    if (
      abs(ballX - catHitX) < 40 &&
      abs(ballY - catHitY) < 40
    ) {
      direction = false;
      let targetY = constrain(ballY + random(-100, 100), 150, 450);
      p = constrain((targetY - ballY) * 0.03, -5, 5);
      score++;
    }
  } else {
    ballX -= i;
    ballY += p + k;

    let racketCenterX = racketPos.x + 100;
    let racketHeadY = racketPos.y + 60;

    if (
      abs(ballX - racketCenterX) < 30 &&
      abs(ballY - racketHeadY) < 30
    ) {
      direction = true;
      let catTargetY = catY - 200 + 100;
      p = (catTargetY - ballY) * 0.03;
      score++;
    }
  }

  if (ballX < 0 || ballY < 100 || ballY >height - 100) {
    gameOver();
  }

  drawBall(ballX, ballY);
}

function drawBall(x, y) {
  push();
  translate(x, y);
  rotate(10 * frameCount);
  noStroke();
  fill(70, 70, 95);
  circle(0, 0, 30);
  stroke(255);
  strokeWeight(3);
  noFill();
  arc(-10, 0, 30, 30, 330, 40);
  arc(10, 0, 30, 30, 160, 210);
  pop();
}

function gameOver() {
  gameStarted = false;
  push();
  textSize(60);
  fill(0);
  text("Game Over", 700, 500);
  pop();
}

function mousePressed() {
  const racketW = 200;
  const racketH = 320;
  if (
    mouseX >= racketPos.x &&
    mouseX <= racketPos.x + racketW &&
    mouseY >= racketPos.y &&
    mouseY <= racketPos.y + racketH
  ) {
    dragging = true;
    offsetX = mouseX - racketPos.x;
    offsetY = mouseY - racketPos.y;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (dragging) {
    racketPos.x = constrain(mouseX - offsetX, 0, width - 200);
    racketPos.y = constrain(mouseY - offsetY, 80, height - 230);
  }
}
