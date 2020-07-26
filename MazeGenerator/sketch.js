var w = 40;
var cells = [];
var cols, rows;

var current;

var stack = [];

var slider, rst, gen, anim, cwid, chei, cellwidth, save;

var animate = false;

function setup() {
  rst = createButton("Reset");
  rst.mousePressed(reset);

  gen = createButton("Generate");
  gen.mousePressed(generate);

  anim = createButton("Animate");
  anim.mousePressed(anm);

  save = createButton("Save")
  save.mousePressed(saveCan);

  cwid = createInput(800);
  chei = createInput(800);
  cellwidth = createInput(40);

  cwid.parent("cwid");
  chei.parent("chei");
  cellwidth.parent("cellwidth");

  cwid.input(cwidth);
  chei.input(cheight);
  cellwidth.input(cw);

  createCanvas(800, 800);
  cols = floor(width / w);
  rows = floor(height / w);

  reset();
}

function saveCan() {
  saveCanvas("generated_maze", "png");
}

function cwidth() {
  let newWidth = this.value();
  let newHeight = height;

  resizeCanvas(newWidth, newHeight);
  cols = floor(width / w);
  rows = floor(height / w);

  reset();
}

function cheight() {
  let newWidth = width;
  let newHeight = this.value();

  resizeCanvas(newWidth, newHeight);
  cols = floor(width / w);
  rows = floor(height / w);

  reset()
}

function cw() {
  w = floor(this.value());
  cols = floor(width / w);
  rows = floor(height / w);
}

function anm() {
  reset();
  animate = true;
}

function generate() {
  reset();

  do {

    current.visited = true;

    current.highlight();

    let next = current.checkNeighbors();
    if (next) {
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }

    loop++;
  } while (stack.length > 0);

  background(153);
  for (let i = 0; i < cells.length; i++) {
    cells[i].show();
  }
}

function reset() {
  animate = false;
  if (slider) slider.remove();
  cells = [];
  stack = [];

  for (let j = 0; j < rows; j++) {
    for(let i = 0; i < cols; i++) {
      cells.push(new Cell(i, j));
    }
  }

  current = cells[floor(random(0, cells.length))];

  slider = createSlider(0, 1000, 0);

  background(153);
  for (let i = 0; i < cells.length; i++) {
    cells[i].show();
  }
}

function draw() {
    if (animate)
      mazeDraw();
}

var last;
function mazeDraw() {
  let loop = 0;
  while (loop <= slider.value()) {
    current.visited = true;

    current.show();
    current.highlight();

    if (last) last.show();
    last = current;

    let next = current.checkNeighbors();
    if (next) {
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }

    loop++;
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1)
    return -1;

  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;

             // Top, Right, Bottom, Left
  this.walls = [true, true, true, true]
  this.visited = false;

  this.highlight = function() {
    noStroke();
    fill(0, 0, 255, 100);
    rect(this.i * w, this.j * w, w, w);
  }

  this.show = function() {
    let x = i * w;
    let y = j * w;

    noStroke();
    fill(153);
    rect(x, y, w, w);

    stroke(255);
    if (this.walls[0]) line(x, y, x + w, y);
    if (this.walls[1]) line(x + w, y, x + w, y + w);
    if (this.walls[2]) line(x + w, y + w, x, y + w);
    if (this.walls[3]) line(x, y + w, x, y);

    if (this.visited) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(x, y, w, w);
    }
  }

  this.checkNeighbors = function() {
    let neighbors = [];

    let top = cells[index(i, j -  1)];
    let right = cells[index(i + 1, j)];
    let bottom = cells[index(i, j + 1)];
    let left = cells[index(i - 1, j)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return neighbors[floor(random(0, neighbors.length))];
    } else {
      return undefined;
    }
  }
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}