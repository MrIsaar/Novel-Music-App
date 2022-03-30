import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import Cannon from "./Cannon"
import Selection from "./Selection"
import ToneExample from "./ToneSetup"
import * as Tone from 'tone';

var cannons = [];
var balls = [];
var selection = null;
var drums = [];
var sounds = [];
var synth = new Tone.Synth().toDestination();
const width = 800;
const height = 600;


export class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        Tone.start();
    }

    deleteObject() {
        //remove with delete
        //remove with backspace
        //remove by drag out of bounds
    }


    componentDidMount() {
        Tone.start();
        var Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        var engine = Engine.create({
            // positionIterations: 20
        });
        this.engine = engine;
        var render = Render.create({
            element: this.refs.scene,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: 'lightblue'

            }
        });

        var ballA = Bodies.circle(210, 100, 30, { restitution: 0.5 });
        var ballB = Bodies.circle(110, 50, 30, { restitution: 0.5 });
        World.add(engine.world, [
            // walls
            Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
            Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
            Bodies.rectangle(width / 2, height / 2, 50, height, { isStatic: true }),
            Bodies.rectangle(0, height/2, 50, height, { isStatic: true })
        ]);

        World.add(engine.world, [ballA, ballB]);

        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    },
                    collisionFilter: { group: 0, category: 0, mask: 0 }
                }
            });

        World.add(engine.world, mouseConstraint);

        // add red "Drum"
        drums.push(Bodies.rectangle(width * (0.9), height*0.33, 20, 100, {
            isStatic: true, 
            render: {
                fillStyle: "red"
            }
        }))
        drums.push(Bodies.rectangle(width * (0.9), height * 0.66, 20, 100, {
            isStatic: true,
            render: {
                fillStyle: "red"
            }
        }))
        World.add(engine.world, drums)

        let position = { x: width * (0.7), y: height * 0.3 };
        let cannon = new Cannon(position)//<Cannon pos={position} body={null} />;
        cannons.push(cannon);
        position = { x: width * (0.2), y: height * 0.3 };
        cannon = new Cannon(position,1)//<Cannon pos={position} body={null} />;
        cannons.push(cannon);
        for (let i = 0; i < cannons.length; i++) {
            World.add(engine.world, cannons[i].getBody());
        }

        // handle when any collision occurs
       Matter.Events.on(engine, "collisionStart",
           function (event) {
               for (let i = 0; i < event.pairs.length; i++) {
                   for (let j = 0; j < drums.length; j++)
                       if (event.pairs[i].bodyA == drums[j] || event.pairs[i].bodyB == drums[j]) {
                           console.log("*Meep*");
                           synth.triggerAttackRelease('C4', '8n');
                       }
               }
                
            }
        );

        Matter.Events.on(mouseConstraint, "mousedown",
            function (event) {
                let position = { x: event.mouse.position.x, y: event.mouse.position.y }
                if (event.mouse.sourceEvents.mousedown.shiftKey) {
                    //var ball = Matter.Bodies.circle(position.x, position.y, 20);
                    /* World.add(engine.world, [ball]);*/
                    for (let i = 0; i < cannons.length; i++) {
                        let ball = cannons[i].fireMarble(-1);
                        balls.push(ball);
                        World.add(engine.world, [ball]);
                    }
                    if (selection != null) {
                        Matter.Composite.remove(engine.world, selection.bodies)
                        selection = null;
                    }
                }
                else if (event.mouse.sourceEvents.mousedown.altKey) {
                    Tone.start();
                    let position = { x: event.mouse.position.x, y: event.mouse.position.y }

                    let cannon = new Cannon(position)//<Cannon pos={position} body={null} />;
                    cannons.push(cannon);
                    World.add(engine.world, cannon.getBody());
                    //World.add(engine.world, Bodies.circle(event.mouse.position.x, event.mouse.position.y, 30, { restitution: 0.7 }));
                    if (selection != null) {
                        Matter.Composite.remove(engine.world, selection.bodies)
                        selection = null;
                    }
                }
                else {
                    if (selection == null) {

                        let currCannon = null;
                        for (let i = 0; i < cannons.length; i++) {
                            if (Matter.Bounds.contains(cannons[i].body.bounds, position)) {
                                currCannon = cannons[i];
                                break;
                            }
                        }
                        if (currCannon != null) {
                            selection = new Selection(currCannon);
                            World.add(engine.world, selection.bodies);
                        }

                    }
                    else {
                        if (!selection.handleSelection(position.x, position.y)) {
                            if (selection != null) {
                                Matter.Composite.remove(engine.world, selection.bodies)
                                selection = null;
                            }
                            //Check if another cannon should be selected
                            let currCannon = null;
                            for (let i = 0; i < cannons.length; i++) {
                                if (Matter.Bounds.contains(cannons[i].body.bounds, position)) {
                                    currCannon = cannons[i];
                                    break;
                                }
                            }
                            if (currCannon != null) {
                                selection = new Selection(currCannon);
                                World.add(engine.world, selection.bodies);
                            }
                        }
                    }







                }
            }
        );

        Matter.Events.on(mouseConstraint, "mousemove",
            function (event) {
                let position = { x: event.mouse.position.x, y: event.mouse.position.y }
                if (event.source.mouse.button > -1 && selection != null) {
                    selection.handleSelection(position.x, position.y);
                }
            });

        Matter.Events.on(mouseConstraint, "mouseup",
            function (event) {
                let position = { x: event.mouse.position.x, y: event.mouse.position.y }
                if (selection != null) {
                    selection.cleanMode();
                }
            });

        Engine.run(engine);

        Render.run(render);
    }

    fireBalls() {
        for (let i = 0; i < cannons.length; i++) {
            let ball = cannons[i].fireMarble(-1);
            balls.push(ball);
            Matter.World.add(this.engine.world, [ball]);
        }
        if (selection != null) {
            Matter.Composite.remove(this.engine.world, selection.bodies)
            selection = null;
        }
    }


    render() {
        
        sounds.push(<div>
            <ToneExample />
        </div>);
        return (
            <div>
                <div>{sounds}</div>
                <button onClick={this.fireBalls.bind(this)}>---------FIRE---------</button>
                <div ref="scene" />
                <p>alt click to create a cannon, shift click to fire.<br />
                    click to select cannons to move or rotate</p>
            </div>
        );
    }
}
export default Scene;