var w = 40;
var gameWidth = 9;
var gameHeight = 9;
var mines = 10;
var board = [];
var over = false;

var started = false;

function setup() {
  createCanvas(gameWidth * w, gameHeight * w);

  for (let j = 0; j < gameHeight; j++) {
    for (let i = 0; i < gameWidth; i++) {
      board.push(new Cell(i, j));
    }
  }
}

function draw() {
  for (let i = 0; i < board.length; i++) {
    board[i].show();
  }

  if (over) {
    fill(255, 0, 0, 255);
    textAlign(CENTER, CENTER);
    textSize(height / 8);
    text("Game Over!", width / 2, height / 2);

    for (let i = 0; i < board.length; i++) {
      board[i].endGame();
    }
  }
}

function generateMines(xx, yy) {
  for (let left = mines; left > 0; left--) {
    var COI = board[floor(random(0, board.length))];
    if (COI.mine || board[index(xx, yy)] == COI)
      left++;
    else
      COI.mine = true;
  }
}

function gameover() {
  noLoop();
  over = true;
}

function keyTyped() {
  if (key === 'f') {
    let x = floor(mouseX / w)
    let y = floor(mouseY / w)

    board[index(x, y)].flag = !board[index(x, y)].flag;
  }
}

function mouseClicked(event) {
  let x = floor(mouseX / w)
  let y = floor(mouseY / w)

  if (!started && !board[index(x, y)].flag) {
    started = true;
    generateMines(x, y);

    for (let i = 0; i < board.length; i++) {
      board[i].calculateNeighbors();
    }
  }

  if (!board[index(x, y)].mine) {
    if (!board[index(x, y)].flag) {
      board[index(x, y)].hidden = false;
      board[index(x, y)].auto();
    }
  } else {
    gameover();
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > gameWidth - 1 || j > gameHeight - 1)
    return -1;

  return i + j * gameWidth;
}


class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.mine = false;
    this.hidden = true;
    this.flag = false;
    this.nearby = 0;

    this.show = function () {
      let x = i * w;
      let y = j * w;

      stroke(0);
      if (this.hidden) {
        fill(240);
        rect(x, y, w, w);
        if (this.flag) {
          fill(0, 0, 255, 100);
          rect(x, y, w, w);
        }
      } else {
        fill(190);
        rect(x, y, w, w);

        if (this.nearby != 0) {
          fill(0);
          textAlign(CENTER, CENTER);
          textSize(w);
          text(this.nearby, x + w/2, y + w/2 + 3);
        }
      }
    };

    this.calculateNeighbors = function() {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          var near = board[index(this.i + x, this.j + y)];
          if (near && near.mine) {
            this.nearby++;
          }
        }
      }
    }

    this.endGame = function() {
      let x = i * w;
      let y = j * w;

      if (this.mine) {
        fill(255, 0, 0, 100);
        rect(x, y, w, w);
      }
    }

    this.auto = function() {
      var ct = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          var near = board[index(this.i + x, this.j + y)];
          if (near && near.mine) {
            ct++;
          }
        }
      }

      if (ct == 0) {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            var near = board[index(this.i + x, this.j + y)];
            if (near) near.hidden = false;
          }
        }
      }
    }
  }
}
