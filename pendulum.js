let sizeX = 600;
let sizeY = 600;
let g = 1; //gravity
let myArms = [];
let trace = false;
let traceArms = true;
let traceSpeed = false;
let paused = false;
let globalDump = 0.01;
let arms = 4;
let X = 300;
let Y = 100;
let len = 50
let wid = 6;
let wei = 100;

let slideG;
let slideArms;
let checkTrace;
let slideDump;
let slideLenght;
let slideWidth
let slideWeight;
let checkArms;
let pauseButton;
let checkSpeed;

var time = 1;
var traced;
var fr = 40;
var selected = -1;
var maxVel = 0.6;


function setup() {
  sizeX = windowWidth;
  sizeY = windowHeight - 85;
  X = int(sizeX/2);
  Y = int(sizeY * 0.15);
  var canvas = createCanvas(sizeX, sizeY);
  traced = createGraphics(sizeX, sizeY);
  canvas.position(0, 80);


  var text = createDiv("Gravity:");
  var col = color(0, 0, 255);

  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(0, 0);
  slideG = createSlider(0, 1.4, g, 0.03);
  slideG.position(60, 0);

  text = createP("Arms:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(0, 20);
  slideArms = createSlider(1, 20, arms, 1);
  slideArms.position(60, 20);

  var playButton = createButton('Reset');
  playButton.position(20, 45);
  playButton.mousePressed(go);

  pauseButton = createButton('Pause');
  pauseButton.position(90, 45);
  pauseButton.mousePressed(pause);

  text = createP("Dump:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(200, 0);
  slideDump = createSlider(0, 0.1, globalDump, 0.01);
  slideDump.position(260, 0);

  text = createP("Trace:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(200, 20);
  checkTrace = createCheckbox("", trace);
  checkTrace.position(300, 20);

  text = createP("Draw Arms:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(200, 40);
  checkArms = createCheckbox("", traceArms);
  checkArms.position(300, 40);

  text = createP("Draw Speeds:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(200, 60);
  checkSpeed = createCheckbox("", traceSpeed);
  checkSpeed.position(300, 60);

  text = createP("Lenght:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(400, 0);
  slideLenght = createSlider(1, 300, len, 3);
  slideLenght.position(460, 0);

  text = createP("Width:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(400, 20);
  slideWidth = createSlider(1, 30, wid, 1);
  slideWidth.position(460, 20);

  text = createP("Weight:");
  text.style('color', col);
  text.style('margin', 0);
  text.style('padding', 0);
  text.position(400, 40);
  slideWeight = createSlider(1, 500, wei, 5);
  slideWeight.position(460, 40);

  frameRate(fr);

  setArms();
}

function go() {
  g = slideG.value();
  arms = slideArms.value();
  trace = checkTrace.checked();
  traceArms = checkArms.checked();
  traceSpeed = checkSpeed.checked();
  globalDump = slideDump.value();
  len = slideLenght.value();
  wid = slideWidth.value();
  wei = slideWeight.value();
  setArms();
  background(255);
  traced = createGraphics(sizeX, sizeY);
  pauseButton.html("Pause");
  paused = false;
}

function pause() {
  g = slideG.value();
  trace = checkTrace.checked();
  traceArms = checkArms.checked();
  traceSpeed = checkSpeed.checked();
  globalDump = slideDump.value();
  wid = slideWidth.value();
  if (paused) {
    pauseButton.html("Pause");
    paused = false;
  } else {
    pauseButton.html("Unpause");
    for (var a = 0; a < myArms.length; a++) {
      myArms[a].draw();
    }
    paused = true;
  }

}


function setArms() {
  var inPos = PI / 2;
  if (myArms[0]) {
    X = myArms[0].X;
    Y = myArms[0].Y;
  }
  myArms = [];
  for (var a = 0; a < arms; a++) {
    myArms.push(new Arm(a, {
      x: X,
      y: Y
    }, len, wid, wei, inPos));
    if (a > 0) {
      myArms[a - 1].attach(myArms[a]);
    }
  }
}

function draw() {
  background(255);
  for (var a = 0; a < myArms.length; a++) {
    if (!paused) myArms[a].move(time);
    myArms[a].draw();
  }
  if (trace) {
    image(traced, 0, 0);
  }
  if (selected >= 0) {
    var arm = myArms[selected];
    if (keyCode === 16 && keyIsPressed === true) {
      arm.weight -= (mouseY + mouseX - pmouseY - pmouseX);
      arm.weight = abs(arm.weight);
    } else if (keyCode === 18 && keyIsPressed === true) {
      arm.Vel += (mouseY + mouseX - pmouseY - pmouseX) / (sizeX / (3 * maxVel));
      arm.showSpeed();
    } else {
      stretchEnd(arm, mouseX, mouseY);
    }
  }
  if (selected == -2) {
    var arm = myArms[0];
    arm.X += (mouseX - pmouseX);
    arm.Y += (mouseY - pmouseY);
    arm.rePos({
      x: arm.X,
      y: arm.Y
    });
    if (arm.attachedTo)
      stretchEnd(arm.attachedTo, arm.X, arm.Y);
  }


  trace = checkTrace.checked();
  traceArms = checkArms.checked();
  traceSpeed = checkSpeed.checked();
}

function stretchEnd(arm, xe, ye) {
  var xb = arm.X;
  var yb = arm.Y;

  var dX = xb - xe;
  var dY = yb - ye;

  arm.lenght = sqrt(dX ** 2 + dY ** 2);

  if (dX > 0) {
    arm.angle = acos((dY) / arm.lenght) + PI;
  } else if (dY > 0) {
    arm.angle = asin((dX) / arm.lenght) + PI;
  } else {
    arm.angle = atan((xe - arm.X) / (ye - arm.Y));
  }

  arm.rePos({
    x: arm.X,
    y: arm.Y
  });
}

function mousePressed() {
  selected = -1;
  var d = sqrt((myArms[0].X - mouseX) ** 2 + (myArms[0].Y - mouseY) ** 2);
  if (d <= myArms[0].width / 2) {
    selected = -2;
    return;
  }

  for (var i = myArms.length - 1; i >= 0; i--) {
    var endPos = myArms[i].pointIn(myArms[i].X, myArms[i].Y + myArms[i].lenght);
    var d = sqrt((endPos.x - mouseX) ** 2 + (endPos.y - mouseY) ** 2);
    if (d <= myArms[i].weight / 2) {
      selected = i;
      break;
    }
  }
}

function mouseReleased() {
  selected = -1;
}








class Arm {
  constructor(id, pivot, lenght, width, weight, inPos, inVel, dump) {
    // pivot {x, y} position of the fixed point
    // lenght: lengh of the rod
    // width: width of the rod
    // weight: weight (KG) of the rod
    // inPos: initial position of the rod in radians (0:up, PI: down)
    // inVel: initial velocity
    // dump: dumping on the total energy
    this.accel = 0;
    this.Vel = inVel || 0;
    this.angle = inPos || PI / 2;
    this.pAngle = this.angle;
    this.dump = dump || globalDump;
    this.PE = weight * g * abs(lenght * (1 - cos(this.angle))); // Potential Energy
    this.KE = 0.5 * weight * this.Vel ** 2; // Kinetic Energy
    this.EN = this.PE + this.KE; //total Energy
    this.id = id;
    this.pX = -1;
    this.pY = -1;
    this.pmX=-1
    this.pmY=-1;
    this.setArm(pivot, lenght, width, weight / 5);
  }

  setArm(pivot, lenght, width, weight) {
    this.relCX = width / 2;
    this.relCY = lenght;
    this.X = pivot.x;
    this.Y = pivot.y;
    this.cX = this.relCX + this.X;
    this.cY = this.relCY + this.Y;
    this.lenght = lenght;
    this.width = width;
    this.weight = weight;
    this.a1 = atan(this.relCX / this.relCY);
    this.d1 = sqrt(this.relCX ** 2 + this.relCY ** 2);
    this.a2 = -this.a1;
    this.d2 = this.d1;
    this.a3 = PI + atan(this.relCX / (this.lenght - this.relCY));
    this.d3 = sqrt(this.relCX ** 2 + (this.lenght - this.relCY) ** 2);
    this.a4 = PI - atan(this.relCX / (this.lenght - this.relCY));
    this.d4 = this.d3;
    this.dir = 1;
  }

  draw() {
    var x1 = this.X + sin(this.a1 + this.angle) * this.d1;
    var y1 = this.Y + cos(this.a1 + this.angle) * this.d1;
    var x2 = this.X + sin(this.a2 + this.angle) * this.d2;
    var y2 = this.Y + cos(this.a2 + this.angle) * this.d2;
    var x3 = this.X + sin(this.a3 + this.angle) * this.d3;
    var y3 = this.Y + cos(this.a3 + this.angle) * this.d3;
    var x4 = this.X + sin(this.a4 + this.angle) * this.d4;
    var y4 = this.Y + cos(this.a4 + this.angle) * this.d4;

    var blue = abs(5 * this.accel / this.Vel) * 255;
    var green = 0;
    var red = abs(1 / blue) * 255;


    if (traceArms || paused) {
      stroke(125, 50);
      fill(100, 250);
      quad(x1, y1, x2, y2, x3, y3, x4, y4);
      fill(0);
      circle(this.X, this.Y, this.width);
      stroke(red, green, blue, 255);
      fill(red, green, blue, 255);
      circle(this.X + sin(this.angle) * this.lenght, this.Y + cos(this.angle) * this.lenght, this.weight);


    }

    var x = this.X;
    var y = this.Y + this.lenght;
    var newPos = this.pointIn(x, y);
    if (this.pX != -1 && !paused) {
      traced.stroke(red, green, blue, 255);
      traced.fill(red, green, blue, 255);
      traced.strokeWeight(1);
      if (this.pmX == -1){
      traced.line(this.pX, this.pY, newPos.x, newPos.y);
      } else if(this.pmX != this.pX && this.pmX != newPos.x) {
      //trying to make the trace smoother when there is too much of a jump
      traced.noFill();
      traced.beginShape();
      traced.curveVertex(this.pmX,this.pmY);
        traced.curveVertex(this.pmX,this.pmY);
        traced.curveVertex(this.pX, this.pY);
      traced.curveVertex(this.pX, this.pY);

      traced.curveVertex(newPos.x, newPos.y);
      traced.curveVertex(newPos.x, newPos.y);
      traced.endShape();
      }

      if (this.angle > TWO_PI) this.angle -= TWO_PI;
      if (this.angle < 0) this.angle += TWO_PI;
      this.pAngle = this.angle;

    }
    this.pmX=this.pX;
    this.pmY=this.pY;
    this.pX = newPos.x;
    this.pY = newPos.y;
    if (traceSpeed) this.showSpeed();
  }

  pointIn(x, y) {
    var dist = sqrt((y - this.Y) ** 2 + (this.X - x) ** 2);
    var retX = this.X + sin(this.angle) * dist;
    var retY = this.Y + cos(this.angle) * dist;
    return ({
      x: retX,
      y: retY
    });
  }

  showSpeed() {
    var x1 = this.X + sin(this.angle) * this.lenght;
    var y1 = this.Y + cos(this.angle) * this.lenght;
    var x2 = x1 + sin(this.angle + PI / 2) * this.Vel * (sizeX / (3 * maxVel));
    var y2 = y1 + cos(this.angle + PI / 2) * this.Vel * (sizeX / (3 * maxVel));
    var t1x, t1y, t2x, t2y;
    if (this.Vel > 0) {
      t1x = x2 + sin(this.angle + 4 * PI / 3) * (sizeX / 50);
      t1y = y2 + cos(this.angle + 4 * PI / 3) * (sizeX / 50);
      t2x = x2 + sin(this.angle - PI / 3) * (sizeX / 50);
      t2y = y2 + cos(this.angle - PI / 3) * (sizeX / 50);
    } else {
      t1x = x2 + sin(this.angle - 4 * PI / 3) * (sizeX / 50);
      t1y = y2 + cos(this.angle - 4 * PI / 3) * (sizeX / 50);
      t2x = x2 + sin(this.angle + PI / 3) * (sizeX / 50);
      t2y = y2 + cos(this.angle + PI / 3) * (sizeX / 50);

    }

    push();
    strokeWeight(5);
    stroke(128);
    line(x1, y1, x2, y2);
    stroke(50);
    line(x2, y2, t1x, t1y);
    line(x2, y2, t2x, t2y);
    pop();

  }

  attach(other) {
    this.attached = other;
    other.attachedTo = this;
    var x = this.X;
    var y = this.Y + this.lenght;
    var newPos = this.pointIn(x, y);
    other.rePos(newPos);
  }

  totalWeight() {
    var total = this.weight;
    if (this.attached) {
      total += this.attached.totalWeight() * abs(cos(this.attached.angle - this.angle));
    }
    return (total);
  }

  rePos(newPivot) {
    this.setArm(newPivot, this.lenght, this.width, this.weight);
    if (this.attached) {
      var x = this.X;
      var y = this.Y + this.lenght;
      var newPos = this.pointIn(x, y);
      this.attached.rePos(newPos);
    }
  }

  move(seconds) {
    if (this.attached) {
      this.push(this.attached, seconds);
      var x = this.X;
      var y = this.Y + this.lenght;
      var newPos = this.pointIn(x, y);
      this.attached.rePos(newPos);
    }
  }

  push(other, seconds) {
    /*
    var m1 = this.totalWeight();
    var m2 = other.totalWeight();
    */
    var m1 = this.weight;
    var m2 = other.weight;

    var accel1 = this.accel;
    var accel2 = other.accel;

    var Vel1 = this.Vel * (1 - globalDump);
    var Vel2 = other.Vel * (1 - globalDump);

    var angle1 = this.angle;
    var angle2 = other.angle;

    var l1 = this.lenght;
    var l2 = other.lenght;

    var num1 = -g * (2 * m1 + m2) * sin(angle1);
    var num2 = -m2 * g * sin(angle1 - 2 * angle2);
    var num3 = -2 * sin(angle1 - angle2) * m2 * (Vel2 * Vel2 * l2 + Vel1 * Vel1 * l1 * cos(angle1 - angle2));
    var den = l1 * (2 * m1 + m2 - m2 * cos(2 * angle1 - 2 * angle2));
    accel1 = (num1 + num2 + num3) / den;

    num1 = 2 * sin(angle1 - angle2);
    num2 = Vel1 * Vel1 * l1 * (m1 + m2);
    num3 = g * (m1 + m2) * cos(angle1) + Vel2 * Vel2 * l2 * m2 * cos(angle1 - angle2);
    den = l2 * (2 * m1 + m2 - m2 * cos(2 * angle1 - 2 * angle2));
    accel2 = (num1 * (num2 + num3)) / den;

    Vel1 += accel1 * seconds;
    Vel2 += accel2 * seconds;

    Vel1 = constrain(Vel1, -maxVel * time, maxVel * time);
    Vel2 = constrain(Vel2, -maxVel * time, maxVel * time);

    angle1 += Vel1 * seconds;
    angle2 += Vel2 * seconds;

    this.angle = angle1;
    other.angle = angle2;

    this.accel = accel1;
    this.Vel = Vel1;

    other.accel = accel2;
    other.Vel = Vel2;
  }
}