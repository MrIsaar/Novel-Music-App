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
var height = 800;
var width = 1200;


var options = { restitution: 1, friction: 0 };
var radius = 6;
var maxBalls = [height/(2.5 * radius), 150/radius];


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


/*var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);*/
var ground = Bodies.rectangle(width / 2, height, width, 50, { isStatic: true });
var walls = [Bodies.rectangle(0, height / 2, 20, height, { isStatic: true }), Bodies.rectangle(width, height / 2, 20, height, { isStatic: true })];

let fangle = (3.14 / 6); let fhight = 50; let fthick = 15
var funnel = [Bodies.rectangle(0, fhight, width - 20, fthick, { isStatic: true, angle: fangle, friction: 0 }), Bodies.rectangle(width, fhight, width - 20, fthick, { isStatic: true, angle: -fangle, friction: 0 })];

//var midBox = Bodies.rectangle(400, 500, 60, 60, { isStatic: true, angle: 3.14 / 4 });

for (let i = 0; i < maxBalls[0]; i++) {
    for (let j = 0; j < maxBalls[1]; j++) {
        let xpos = ((j % 2) * (width / (2 * maxBalls[0]))) + i * (width / maxBalls[0]);
        let ypos = j * 2 * radius;
        let heightOff = Math.abs(((width / 2) * Math.tan(fangle)) / (width / 2) * (width / 2));
        if (ypos < -Math.abs(((width / 2) * Math.tan(fangle)) / (width / 2) * (xpos - width / 2)) + heightOff + 2 * radius) // y > |m * x + b|
            balls.push(Bodies.circle(xpos, ypos, radius, options));
    }
}


let maxSlots = width/(3*radius + 30);
let layers = (height / 50);
for (let i = 0; i < maxSlots; i++) {
    slots.push(Bodies.rectangle(10 + i * (width / maxSlots), height - 10, 15, height * (45/100), { isStatic: 1 }));
    for (let j = 0; j < layers; j++) {
        let ypos = height - (height * (24 / 100)) - (j * 50);
        let xpos = 10 + (25 * (j % 2)) + i * (width / maxSlots);
        let heightOff = Math.abs(((width / 2) * Math.tan(fangle)) / (width / 2) * ((width) / 2));
        if (ypos > -Math.abs(((width / 2) * Math.tan(fangle)) / (width / 2) * (xpos - width / 2)) + heightOff + height/15) // y > |m * x + b|
             slots.push(Bodies.rectangle(xpos,ypos, 10, 10, { isStatic: true, angle: 3.14 / 4 }));
    }
    /*slots.push(Bodies.rectangle(25 + i * (1000 / maxSlots), 400, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), 350, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(25 + i * (1000 / maxSlots), 300, 15, 15, { isStatic: true, angle: 3.14 / 4 }));
    slots.push(Bodies.rectangle(0 + i * (1000 / maxSlots), 250, 15, 15, { isStatic: true, angle: 3.14 / 4 }));*/
}


// add all of the bodies to the world
Composite.add(engine.world, [ground]);
Composite.add(engine.world, walls);
Composite.add(engine.world, funnel);
Composite.add(engine.world, balls);
Composite.add(engine.world, slots);


// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
