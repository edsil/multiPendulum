var sizeX, sizeY; //Screen size
var X, Y; // position of the top of the first arms
var myArms = []; // Array with each arm details
// Initial parameters
var g = 1; //gravity
var trace = false; //trace the movement of the bobs
var traceArms = true; // show arms
var traceSpeed = false; // show arrow with the speed
var paused = false; // is the program paused
var globalDump = 0.01; // dumpness - slows down with time
var arms = 4; // number of arms
var len = 50 // lenght
var wid = 2; // width
var wei = 100; // weight
let showHelp = false; // Help text is shown
// Holders for the buttons, sliders, checkboxes
var slideG, slideArms, slideDump, slideLenght, slideWidth, slideWeight;
var checkTrace, checkArms, checkSpeed;
let pauseButton, showHelpButton, clearTraceButton;

var traced; //Placehoder for the traced canvas
var time = 1;
var fr = 40; //Frames per second
var selected = -1; //Which bob is selected
var maxVel = 0.6; //Maximum velocity
var helpText = "- Click and drag the end of each pendulum to change its position \n"
helpText += "- Hold the SHIFT key while dragging to change the pendulum weight/size \n"
helpText += "- Hold the ALT / OPTION key while dragging to change the pendulum weight/size \n"
helpText += "- All those operations can be done with the pendulum moving or paused \n"


function setup() {
  sizeX = windowWidth;
  sizeY = windowHeight - 85;
  X = int(sizeX / 2);
  Y = int(sizeY * 0.15);
  var canvas = createCanvas(sizeX, sizeY);
  traced = createGraphics(sizeX, sizeY);
  canvas.position(0, 80);

  var text = createP("Gravity:");
  var col = color(0, 0, 255); //Text Color
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
  playButton.position(5, 45);
  playButton.mousePressed(playSimulation);

  pauseButton = createButton('Pause');
  pauseButton.position(60, 45);
  pauseButton.mousePressed(togglePause);

  clearTraceButton = createButton("Clear Trace");
  clearTraceButton.position(5, 65);
  clearTraceButton.mousePressed(clearTraced);

  showHelpButton = createButton("Show Help");
  showHelpButton.position(460, 65);
  showHelpButton.mousePressed(toggleHelp);

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

  if (showHelp) text(helpText, 5, 15);
}

function playSimulation() {
  g = slideG.value();
  arms = slideArms.value();
  globalDump = slideDump.value();
  len = slideLenght.value();
  wid = slideWidth.value();
  wei = slideWeight.value();
  setArms();
  traced = createGraphics(sizeX, sizeY);
  pauseButton.html("Pause");
  paused = false;
}

function togglePause() {
  g = slideG.value();
  globalDump = slideDump.value();
  wid = slideWidth.value();
  if (paused) {
    pauseButton.html("Pause");
    paused = false;
  } else {
    pauseButton.html("Unpause");
    paused = true;
  }
}

function toggleHelp() {
  if (showHelp) {
    showHelp = false;
    showHelpButton.html("Show Help");
  } else {
    showHelp = true;
    showHelpButton.html("Hide Help");
  }
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

function clearTraced() {
  traced.clear();
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
    this.pmX = -1
    this.pmY = -1;
    //Trace color (random)
    this.tc = color(int(random(255)),int(random(255)),int(random(255)));
    this.setArm(pivot, lenght, width, weight / 5);
  }

  setArm(pivot, lenght, width, weight) {
    this.relCX = width / 2;
    this.relCY = lenght;
    this.X = pivot.x;
    this.Y = pivot.y;
    //this.cX = this.relCX + this.X;
    //this.cY = this.relCY + this.Y;
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
    //this.dir = 1;
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

    var red = abs(this.Vel * 3) * 255;
    var green = 0;
    var blue = (this.angle / (2 * PI));


    if (traceArms || paused) {
      stroke(125, 50);
      if (selected == this.id) {
        fill(255, 0, 0);
      } else fill(100, 250);
      quad(x1, y1, x2, y2, x3, y3, x4, y4);
      fill(this.tc);
      circle(this.X, this.Y, this.width);
      stroke(red, green, blue, 255);
      if (selected == this.id) {
        fill(255, 0, 0);
      } else fill(this.tc);;
      circle(this.X + sin(this.angle) * this.lenght, this.Y + cos(this.angle) * this.lenght, this.weight);
    }

    var x = this.X;
    var y = this.Y + this.lenght;
    var newPos = this.pointIn(x, y);
    if (this.pX != -1 && !paused) {
      traced.stroke(this.tc);
      traced.strokeWeight(1);
      if (this.pmX == -1) {
        traced.line(this.pX, this.pY, newPos.x, newPos.y);
      } else if (this.pmX != this.pX && this.pmX != newPos.x) {
        //trying to make the trace smoother when there is too much of a jump
        traced.noFill();
        traced.beginShape();
        traced.curveVertex(this.pmX, this.pmY);
        //traced.curveVertex(this.pmX,this.pmY);

        traced.curveVertex(this.pX, this.pY);

        traced.curveVertex(newPos.x, newPos.y);
        traced.curveVertex(newPos.x, newPos.y);
        traced.endShape();
      }

      if (this.angle > TWO_PI) this.angle -= TWO_PI;
      if (this.angle < 0) this.angle += TWO_PI;
      this.pAngle = this.angle;

    }
    this.pmX = this.pX;
    this.pmY = this.pY;
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
    var arrowsize = 10;
    if (this.Vel > 0) {
      t1x = x2 + sin(this.angle + 4 * PI / 3) * arrowsize;
      t1y = y2 + cos(this.angle + 4 * PI / 3) * arrowsize;
      t2x = x2 + sin(this.angle - PI / 3) * arrowsize;
      t2y = y2 + cos(this.angle - PI / 3) * arrowsize;
    } else {
      t1x = x2 + sin(this.angle - 4 * PI / 3) * arrowsize;
      t1y = y2 + cos(this.angle - 4 * PI / 3) * arrowsize;
      t2x = x2 + sin(this.angle + PI / 3) * arrowsize;
      t2y = y2 + cos(this.angle + PI / 3) * arrowsize;

    }

    push();
    strokeWeight(2);
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
    if (selected == this.id || selected == other.id) return;
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
