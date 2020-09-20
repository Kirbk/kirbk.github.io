var w = 20;
var gameWidth = 40;
var gameHeight = 40;
var board = [];
var run = false;

var div;

function setup() {
  createCanvas(gameWidth * w, gameHeight * w);

  div = createElement("thing");

  div.parent("running");
  div.html("Not Running");

  for (let j = 0; j < gameHeight; j++) {
    board[j] = [];
    for (let i = 0; i < gameWidth; i++) {
      board[j].push(0);
    }
  }

  update();
}

function count_neighbors(b, i, j) {
  var count = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (i+y >= 0 && i+y < gameHeight && j+x >= 0 && j+x < gameWidth) {
        var near = b[i+y][j+x];
        if (near === 1 && !(y === 0 && x === 0)) {
          count++;
        }
      }
    }
  }

  return count;
}

function update() {
  var tempboard = [];
  for (let j = 0; j < gameHeight; j++) {
    tempboard[j] = [];
    for (let i = 0; i < gameWidth; i++) {
      tempboard[j].push(board[j][i]);
    }
  }

  for(let j = 0; j < gameHeight; j++) {
    for (let i = 0; i < gameWidth; i++) {
      let c = count_neighbors(tempboard, j, i);
      if (tempboard[j][i] === 1) {
        if (c < 2 || c > 3) board[j][i] = 0;
      } else {
        if (c === 3) board[j][i] = 1;
      }
    }
  }
}

function keyTyped() {
  if (key === ' ') {
    run = !run;
    div.html(run ? "Running" : "Not Running");
  }
}

function mouseClicked(event) {
  let x = floor(mouseX / w)
  let y = floor(mouseY / w)

  if (!run) {
    board[y][x] = (board[y][x] === 0) ? 1 : 0;
  }
}

function draw() {
  for (let j = 0; j < gameHeight; j++) {
    for (let i = 0; i < gameWidth; i++) {
      fill((board[j][i] === 0) ? 255 : 0);
      rect(i * w, j * w, w, w);
    }
  }

  if (run) {
    update();
  }
}