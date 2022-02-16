// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var balls = [];
var slots = [];
var height = 1000;
var width = 1000;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine, options: {
        width: width,
        height: height,
        wireframes: false
    }
});

// create two boxes and a ground
let maxBalls = [40 , 7];
for (let i = 0; i < maxBalls[0]; i++) {
    for (let j = 0; j < maxBalls[1]; j++) {
        balls.push(Bodies.circle(((j % 2) * (500 / maxBalls[0])) + i * (1000/maxBalls[0]), j * 20, 10, { restitution: 0.9  , friction: 0.001}));
    }
}
/*var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);*/
var ground = Bodies.rectangle(width/2, height, width, 50, { isStatic: true });
var funnel = [Bodies.rectangle(0, 100, width - 20, 10, { isStatic: true, angle: 3.14 / 10, friction: 0 }), Bodies.rectangle(width, 100, width - 20, 10, { isStatic: true, angle: -3.14 / 10, friction: 0})];

//var midBox = Bodies.rectangle(400, 500, 60, 60, { isStatic: true, angle: 3.14 / 4 });

let maxSlots = 20;
for (let i = 0; i < maxSlots; i++) {
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), height - 10, 15, 350, { isStatic: 1 }));
    for (let j = 0; j < 11; j++) {
        slots.push(Bodies.rectangle((25 * (j % 2)) + i * (1000 / maxSlots), height - 190 - (j * 50), 10, 10, { isStatic: true, angle: 3.14 / 4 }));
    }
    /*slots.push(Bodies.rectangle(25 + i * (1000 / maxSlots), 400, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), 350, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(25 + i * (1000 / maxSlots), 300, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), 250, 15, 15, { isStatic: true, angle: 3.14 / 4 }));*/
}


// add all of the bodies to the world
Composite.add(engine.world, [ground]);
Composite.add(engine.world, funnel);
Composite.add(engine.world, balls);
Composite.add(engine.world, slots);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
