/***********
 * GLOBALS *
 ***********/
const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

var balls = [],
    slots = [];
var ground, walls, funnel, objects;
const HEIGHT = 800;
const WIDTH = 1200;

/**********************
 * RENDERING WRAPPERS *
 **********************/
class Rect {
  constructor(x, y, width, height, options) {
    this.width = width;
    this.height = height;

    this.body = Bodies.rectangle(x, y, width, height, options);
  }

  render() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    fill(this.body.render.fillStyle);
    stroke(this.body.render.strokeStyle);
    strokeWeight(this.body.render.lineWidth);
    rect(0, 0, this.width, this.height);
    pop();
  }
}

class Circle {
  constructor(x, y, r, options) {
    this.body = Bodies.circle(x, y, r, options);
  }

  render() {
    push();
    fill(this.body.render.fillStyle);
    noStroke();
    circle(this.body.position.x, this.body.position.y, 2 * this.body.circleRadius);
    pop();
  }
}

function setup() {
  /********************
   * SIMULATION SETUP *
   ********************/
  var options = { restitution: 1, friction: 0 };
  var radius = 6;
  var maxBalls = [HEIGHT/(2.5 * radius), 150/radius];

  // create an engine
  var engine = Engine.create();

  // create ground and walls
  ground = new Rect(WIDTH / 2, HEIGHT, WIDTH, 50, { isStatic: true });
  walls = [new Rect(0, HEIGHT / 2, 20, HEIGHT, { isStatic: true }), new Rect(WIDTH, HEIGHT / 2, 20, HEIGHT, { isStatic: true })];

  let fangle = (3.14 / 6); let fhight = 50; let fthick = 15
  funnel = [new Rect(0, fhight, WIDTH - 20, fthick, { isStatic: true, angle: fangle, friction: 0 }), new Rect(WIDTH, fhight, WIDTH - 20, fthick, { isStatic: true, angle: -fangle, friction: 0 })];

  for (let i = 0; i < maxBalls[0]; i++) {
      for (let j = 0; j < maxBalls[1]; j++) {
          let xpos = ((j % 2) * (WIDTH / (2 * maxBalls[0]))) + i * (WIDTH / maxBalls[0]);
          let ypos = j * 2 * radius;
          let heightOff = Math.abs(((WIDTH / 2) * Math.tan(fangle)) / (WIDTH / 2) * (WIDTH / 2));
          if (ypos < -Math.abs(((WIDTH / 2) * Math.tan(fangle)) / (WIDTH / 2) * (xpos - WIDTH / 2)) + heightOff + 2 * radius) // y > |m * x + b|
              balls.push(new Circle(xpos, ypos, radius, options));
      }
  }

  let maxSlots = WIDTH/(3*radius + 30);
  let layers = (HEIGHT / 50);
  for (let i = 0; i < maxSlots; i++) {
      slots.push(new Rect(10 + i * (WIDTH / maxSlots), HEIGHT - 10, 15, HEIGHT * (45/100), { isStatic: 1 }));
      for (let j = 0; j < layers; j++) {
          let ypos = HEIGHT - (HEIGHT * (24 / 100)) - (j * 50);
          let xpos = 10 + (25 * (j % 2)) + i * (WIDTH / maxSlots);
          let heightOff = Math.abs(((WIDTH / 2) * Math.tan(fangle)) / (WIDTH / 2) * ((WIDTH) / 2));
          if (ypos > -Math.abs(((WIDTH / 2) * Math.tan(fangle)) / (WIDTH / 2) * (xpos - WIDTH / 2)) + heightOff + HEIGHT/15) // y > |m * x + b|
               slots.push(new Rect(xpos,ypos, 10, 10, { isStatic: true, angle: 3.14 / 4 }));
      }
  }

  // add all of the bodies to the world
  Composite.add(engine.world, [ground.body]);
  Composite.add(engine.world, Array.from(walls, o => o.body));
  Composite.add(engine.world, Array.from(funnel, o => o.body));
  Composite.add(engine.world, Array.from(balls, o => o.body));
  Composite.add(engine.world, Array.from(slots, o => o.body));

  objects = [].concat(ground, walls, funnel, balls, slots);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  /******************
   * RENDERER SETUP *
   ******************/
   createCanvas(WIDTH, HEIGHT);
   rectMode(CENTER);
}

/*******************
 * FRAME RENDERING *
 *******************/
function draw() {
  background('#14151f');
  objects.forEach(o => o.render());
}
