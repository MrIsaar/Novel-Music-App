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

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

// create two boxes and a ground
let maxBalls = [20 , 5];
for (let i = 0; i < maxBalls[0]; i++) {
    for (let j = 0; j < maxBalls[1]; j++) {
        balls.push(Bodies.circle(((j % 2) * (500 / maxBalls[0])) + i * (1000/maxBalls[0]), j * 20, 10, { restitution: 1 }));
    }
}
/*var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);*/
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });


//var midBox = Bodies.rectangle(400, 500, 60, 60, { isStatic: true, angle: 3.14 / 4 });

let maxSlots = 20;
for (let i = 0; i < maxSlots; i++) {
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), 600, 20, 300, { isStatic: 1 }));
    for (let j = 0; j < 6; j++) {
        slots.push(Bodies.rectangle((25 * (j % 2)) + i * (1000 / maxSlots), 450 - (j * 50), 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    }
    /*slots.push(Bodies.rectangle(25 + i * (1000 / maxSlots), 400, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), 350, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(25 + i * (1000 / maxSlots), 300, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), 250, 15, 15, { isStatic: true, angle: 3.14 / 4 }));*/
}


// add all of the bodies to the world
Composite.add(engine.world, [ground]);
Composite.add(engine.world, balls);
Composite.add(engine.world, slots);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
