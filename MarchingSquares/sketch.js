
/**
 * Inspiration from TheCodingTrain, adapted from the wikipedia page on Marching Squares, no interpolation.
 */

let columns, rows, resolution = 10;
let field = [];
let inc = 0.1;
let zoff = 0;
let noise;


function setup() {
  createCanvas(800, 800);
  noise = new OpenSimplexNoise(Date.now());

  columns = 1 + width / resolution;
  rows = 1 + height / resolution;

  for (let i = 0; i < columns; i++) {
  let c = [];
    for (let j = 0; j < rows; j++) {
      c.push(0);
    }
    field.push(c);
  }

  // for (let i = 0; i < columns; i++) {
  //   for (let j = 0; j < rows; j++) {
  //     field[i][j] = floor(random(2))
  //   }
  // }
}

function drawLine(v1, v2) {
  line(v1.x, v1.y, v2.x, v2.y);
}

function fillTri(v1, v2, v3) {
  triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
}

function fillRect(v1, v2) {
  rectMode(CORNERS)
  rect(v1.x, v1.y, v2.x, v2.y);
}

function draw() {
  background(153);

  let xoff = 0;
  for (let i = 0; i < columns; i++) {
    xoff += inc;
    let yoff = 0;
    for (let j = 0; j < rows; j++) {
      field[i][j] = float(noise.noise3D(xoff, yoff, zoff));
      yoff += inc;
    }
  }
  zoff += 0.03;

  // for (let i = 0; i < columns; i++) {
  //   for (let j = 0; j < rows; j++) {
  //     strokeWeight(5);
  //     if (ceil(field[i][j]))
  //       stroke(255);
  //     else
  //       stroke(0);
  //     point(i * resolution, j * resolution);
  //   }
  // }

  for (let i = 0; i < columns - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let x = i * resolution;
      let y = j * resolution;

      let t = createVector(x + resolution * 0.5, y);
      let r = createVector(x + resolution, y + resolution * 0.5);
      let b = createVector(x + resolution * 0.5, y + resolution);
      let l = createVector(x, y + resolution * 0.5);

      let tl = createVector(x, y);
      let tr = createVector(x + resolution, y);
      let br = createVector(x + resolution, y + resolution);
      let bl = createVector(x, y + resolution);

      strokeWeight(1);
      stroke(255, 0);
      fill(255, 0, 0, 100);

      let index = calcBinaryIndex(ceil(field[i][j]), ceil(field[i+1][j]), ceil(field[i+1][j+1]), ceil(field[i][j+1]));
      switch(index) {
        case 1:
          // Working
          drawLine(b, l);
          fillTri(b, l, bl);
          break;
        case 2:
          // Working
          drawLine(b, r);
          fillTri(b, r, br);
          break;
        case 3:
          drawLine(l, r);
          fillRect(l, br);
          break;
        case 4:
          // Working
          drawLine(t, r);
          fillTri(t, r, tr);
          break;
        case 5:
          drawLine(t, l);
          fillTri(t, l, tl);
          drawLine(r, b);
          fillTri(r, b, br);
          break;
        case 6:
          drawLine(t, b);
          fillRect(t, br);
          break;
        case 7:
          drawLine(l, t);
          beginShape();
          vertex(t.x, t.y);
          vertex(tr.x, tr.y);
          vertex(br.x, br.y);
          vertex(bl.x, bl.y);
          vertex(l.x, l.y);
          endShape(CLOSE);
          break;
        case 8:
          // Working
          drawLine(l, t);
          fillTri(l, t, tl);
          break;
        case 9:
          drawLine(t, b);
          fillRect(tl, b);
          break;
        case 10:
          drawLine(t, r);
          fillTri(t, r, tr);
          drawLine(b, l);
          fillTri(b, l, bl);
          break;
        case 11:
          drawLine(t, r);
          beginShape();
          vertex(tl.x, tl.y);
          vertex(t.x, t.y);
          vertex(r.x, r.y);
          vertex(br.x, br.y);
          vertex(bl.x, bl.y);
          endShape(CLOSE);
          break;
        case 12:
          drawLine(l, r);
          fillRect(tl, r);
          break;
        case 13:
          drawLine(b, r);
          beginShape();
          vertex(tl.x, tl.y);
          vertex(tr.x, tr.y);
          vertex(r.x, r.y);
          vertex(b.x, b.y);
          vertex(bl.x, bl.y);
          endShape(CLOSE);
          break;
        case 14:
          drawLine(l, b);
          beginShape();
          vertex(tl.x, tl.y);
          vertex(tr.x, tr.y);
          vertex(br.x, br.y);
          vertex(b.x, b.y);
          vertex(l.x, l.y);
          endShape(CLOSE);
          break;
        case 15:
          fillRect(tl, br);
          break;
      }
    }
  }
}

function calcBinaryIndex(x, y, z, w) {
  return x * 8 + y * 4  + z * 2 + w;
}