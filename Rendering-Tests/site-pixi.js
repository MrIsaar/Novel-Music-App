/***********
 * GLOBALS *
 ***********/
const Engine = Matter.Engine,
      //Render = Matter.Render,
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
class Rect extends PIXI.Graphics {
  constructor(x, y, width, height, options) {
    super();
    this.rectWidth = width;
    this.rectHeight = height;

    this.body = Bodies.rectangle(x, y, width, height, options);
    this.draw();
  }

  draw() {
    this.clear();
    this.x = this.body.position.x;
    this.y = this.body.position.y;
    this.pivot.x = this.rectWidth / 2;
    this.pivot.y = this.rectHeight / 2;
    this.rotation = this.body.angle;
    this.lineStyle(this.body.render.lineWidth, 0x505050);
    this.beginFill(PIXI.utils.string2hex(this.body.render.fillStyle));
    this.drawRect(0, 0, this.rectWidth, this.rectHeight);
    this.endFill();
  }
}

class Circle extends PIXI.Graphics {
  constructor(x, y, r, options) {
    super();
    this.body = Bodies.circle(x, y, r, options);
    this.draw();
  }

  draw() {
    this.clear();
    this.beginFill(PIXI.utils.string2hex(this.body.render.fillStyle));
    this.drawCircle(this.body.position.x, this.body.position.y, this.body.circleRadius);
    this.endFill();
  }
}

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
let app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: 0x14151f,
  antialias: true
});
document.querySelector("#simulation").appendChild(app.view);
objects.forEach(o => app.stage.addChild(o));

/*******************
 * FRAME RENDERING *
 *******************/
app.ticker.add((delta) => objects.forEach(o => o.draw()));
