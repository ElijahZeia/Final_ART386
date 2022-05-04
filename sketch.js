//REFERENCES//

//https://www.youtube.com/watch?v=OIo-DIOkNVg
//https://www.youtube.com/watch?v=uAfw-ko3kB8&t=76s
//https://www.youtube.com/watch?v=GY-c2HO2liA
//https://stackoverflow.com/questions/69429996/how-can-i-rewrite-this-code-to-make-an-object-fall-from-top-of-canvas-and-when-h
//https://happycoding.io/examples/p5js/arrays/falling-points
//https://www.youtube.com/watch?v=EA3-k9mnLHs
//https://www.jsdelivr.com/package/npm/p5.collide2d
//https://p5js.org/examples/input-easing.html

//END_REFERENCES//

var video;
var poseNet;
var pose;
var particles = [];
let x = 1;
let y = 1;
let easing = 0.2;
let noseX;
let noseY;
var screen = 0;
var Mbackground;
var GameOverB;
var Cat;
var Water;


function preload() {
  Mbackground = loadImage("Assets/Background.JPG");
  Cat = loadImage("Assets/Cat.png");
  Water = loadImage("Assets/Water.png");
  GameOverB = loadImage("Assets/GameOver.jpg");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  x = width / 2;
  y = height / 2;
  
  tx = (width/2) + 10
  ty = (height/2) + 400
  
  textFont('Courier New');
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    noseX = poses[0].pose.keypoints[0].position.x;
    noseY = poses[0].pose.keypoints[0].position.y;
  }
}

function modelLoaded() {
  // console.log("poseNet ready");
}

function draw() {
  if (screen == 0) {
    startScreen();
  } else if (screen == 1) {
    gameOn();
  } else if (screen == 2) {
    endScreen();
  }
}

function startScreen() {
  background('lightBlue');
  fill(0);
  textAlign(CENTER);
  textSize(40);
  text("DO NOT GET WET!!!", width / 2, height / 2);
  text("click to start", width / 2, height / 2 + 40);
  
  
  rectMode(CENTER)
  textSize(16);
  stroke(0);
  text(
    
    "The idea behind this work is an upgrade from a previous project that used only the mouse. I wanted to incorporate the camera which was the original idea behind the first iteration. By incorporating the camera it allowed the game to be fully played without the mouse using just the face. This just shows off how I really wanted the game to be played; simply played not needing much to actually be played and it uses things that are normally in need to get to the game. This is in reference to the simple flash games I played as a kid. The game did not need much of anything except for what most computers already had. Simple game, quick experience, and fun times.\n \n \"Don’t Get Splashed\", Elijah A Zeia, 2022"
    
, width/2, (height/2) + 20, tx, ty);
  rectMode(CORNER);
}

function gameOn() {
  background(220);
   imageMode(CORNER);
  image(Mbackground, 0, 0, windowWidth, windowHeight);
   imageMode(CENTER);
  var max_no_of_particles = 70;
  if (particles.length < max_no_of_particles) {
    particles.push([random(12, width - 12), random(-300, 50)]);
  }
  stroke(100);
  for (let i = 0; i < particles.length; i++) {
    particles[i][1] += 1;

    if (particles[i][1] > height) {
      particles[i][1] = 0;
    }

    image(Water, particles[i][0], particles[i][1], 24, 30);
  }

  if (pose) {
    fill(255, 0, 0);
    let targetX = noseX;
    let dx = targetX - x;
    x += dx * easing;

    let targetY = noseY;
    let dy = targetY - y;
    y += dy * easing;
    image(Cat, x, y, 40, 40);
    // ellipse(x, y, 10, 10);
    collide(pose);
  }
}

function collide(poses) {
  for (let i = 0; i < particles.length; i++) {
    Bump = collideCircleCircle(x, y, 30, particles[i][0], particles[i][1], 24);
    // console.log(noseX);
    if (Bump) {
      screen = 2;
    }
  }
}

function endScreen() {
  console.log("GAME OVER1");
  imageMode(CORNER);
  image(GameOverB, 0, 0, windowWidth, windowHeight);
  
  fill("darkBlue");
  textSize(100);
  text("SPLASH!!!", width/2, (height/2) - 300);
  textAlign(CENTER);
}

function mousePressed() {
  if (screen == 0) {
    screen = 1;
  } else if (screen == 2) {
    screen = 0;
  }
}