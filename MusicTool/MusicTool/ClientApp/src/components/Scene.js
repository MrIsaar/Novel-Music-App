import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import Cannon from "./Cannon"
import Selection from "./Selection"
import ToneExample from "./ToneSetup"
import * as Tone from 'tone';
import { Sequencer } from './Sequencer';
import { Rect, Circle } from "./ShapePrimitives";
import * as PIXI from "pixi.js";

var cannons = [];
var balls = [];
var selection = null;
var drums = [];
var sounds = [];
var synth = new Tone.Synth().toDestination();
const width = 800;
const height = 600;


export class Scene extends React.Component {

    /**
     * create Scene object
     * @param {any} props
     */
    constructor(props) {
        super(props);
        this.state = {};
        Tone.start();
    }

    /**
     * removes object from known cannon, ball, or instrument lists
     * returns true if object deleted
     *         false if object not found
     */
    deleteObject(object) {
        //remove with delete
        //remove with backspace
        //remove by drag out of bounds
    }

    /**
     * initiates Matter.js engine and event handlers
     * 
     */
    componentDidMount() {
        //Start engine
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

        this.app = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: 0xadd8e6,
            antialias: true
        });
        this.addChild = this.app.stage.addChild.bind(this.app.stage);

        // add mouse control
        var mouse = Mouse.create(this.app.view),
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



        /**
         *      Handle Collision Interactions
         */
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
        /**
         *      Mouse down handling
         *      
         *      normal click - Select mode
         *      shift click  - Fire marbles from all cannons  - to be removed with sequencer
         *      Alt click    - Create Cannon at location - to be removed with drag and drop
         *      
         */
        Matter.Events.on(mouseConstraint, "mousedown",
            function (event) {
                let position = { x: event.mouse.position.x, y: event.mouse.position.y }

                // shift mode - Fire Cannons - to be removed
                if (event.mouse.sourceEvents.mousedown.shiftKey) {
                    //var ball = Matter.Bodies.circle(position.x, position.y, 20);
                    /* World.add(engine.world, [ball]);*/
                    for (let i = 0; i < cannons.length; i++) {
                        let ball = cannons[i].fireMarble(-1);
                        balls.push(ball);
                        this.addChild(ball);
                        World.add(engine.world, [ball.body]);
                    }
                    if (selection != null) {
                        Matter.Composite.remove(engine.world, selection.bodies)
                        selection = null;
                    }
                }

                // alt mode - to be removed with drag and drop
                else if (event.mouse.sourceEvents.mousedown.altKey) {
                    Tone.start();
                    let position = { x: event.mouse.position.x, y: event.mouse.position.y }

                    let cannon = new Cannon(position)//<Cannon pos={position} body={null} />;
                    cannons.push(cannon);
                    this.addChild(cannon);
                    World.add(engine.world, cannon.getBody());
                    //World.add(engine.world, Bodies.circle(event.mouse.position.x, event.mouse.position.y, 30, { restitution: 0.7 }));
                    if (selection != null) {
                        Matter.Composite.remove(engine.world, selection.bodies)
                        selection = null;
                    }
                }

                // normal click - select object under mouse
                else {
                    // new select object - create new function for this
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
                    // update object depending on selection mode
                    else {
                        if (!selection.handleSelection(position.x, position.y)) {
                            if (selection != null) { // deselect
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


        /**
         *  Handle mouse movement 
         *  updates selected body if clicking
         */
        Matter.Events.on(mouseConstraint, "mousemove",
            function (event) {
                let position = { x: event.mouse.position.x, y: event.mouse.position.y }
                if (event.source.mouse.button > -1 && selection != null) {
                    selection.handleSelection(position.x, position.y);
                }
            });

        /**
         * Handle mouse up
         * sets selection mode to none
         */
        Matter.Events.on(mouseConstraint, "mouseup",
            function (event) {
                let position = { x: event.mouse.position.x, y: event.mouse.position.y }
                if (selection != null) {
                    selection.cleanMode();
                }
            });






        //START Scene Object initialization

        // create inital marbles
        const balls = [
            new Circle(210, 100, 30, { restitution: 0.8 }),
            new Circle(110, 50, 30, { restitution: 0.8 })
        ];
        // create walls
        const walls = [
            new Rect(width / 2, 0, width, 50, { isStatic: true }),
            new Rect(width / 2, height, width, 50, { isStatic: true }),
            new Rect(width / 2, height / 2, 50, height, { isStatic: true }),
            new Rect(0, height / 2, 50, height, { isStatic: true })
        ];
        // create red "Drums"
        drums.push(new Rect(width * (0.9), height * 0.33, 20, 100, {
            isStatic: true,
            render: {
                fillStyle: "red"
            }
        }));
        drums.push(new Rect(width * (0.9), height * 0.66, 20, 100, {
            isStatic: true,
            render: {
                fillStyle: "red"
            }
        }));
        // create initial cannons
        let position = { x: width * (0.7), y: height * 0.3 };
        let cannon = new Cannon(position)//<Cannon pos={position} body={null} />;
        cannons.push(cannon);
        position = { x: width * (0.2), y: height * 0.3 };
        cannon = new Cannon(position, 1)//<Cannon pos={position} body={null} />;
        cannons.push(cannon);

        this.backgroundObjects = [].concat(balls, walls);
        
        World.add(engine.world, Array.from(this.backgroundObjects, o => o.body));
        World.add(engine.world, Array.from(drums, d => d.body));
        World.add(engine.world, Array.from(cannons, c => c.getBody));
        
        this.backgroundObjects.forEach(o => this.addChild(o));
        drums.forEach(d => this.addChild(d));
        cannons.forEach(c => this.addChild(c));

        //END Scene Object initialization
        
        Engine.run(engine);
        document.querySelector("#scene").appendChild(this.app.view);
        this.app.ticker.add((delta) => {
            this.backgroundObjects.forEach(o => o.draw());
            cannons.forEach(c => c.draw());
            balls.forEach(b => b.draw());
        });
    }

    /**
     * Fires balls on fire layer
     * fire layer -1 fires all cannons
     * @param {any} fireLayer default -1
     */
    fireBalls(fireLayer=-1) {
        for (let i = 0; i < cannons.length; i++) {
            let ball = cannons[i].fireMarble(-1);
            balls.push(ball);
            Matter.World.add(this.engine.world, [ball.body]);
            this.addChild(ball);
        }
        if (selection != null) {
            Matter.Composite.remove(this.engine.world, selection.bodies)
            selection = null;
        }
    }

    /**
     * Render React HTML and Links Sequencer to scene
     */
    render() {
        sounds.push(<div>
            <ToneExample />
        </div>);

        let callbacks = [this.fireBalls.bind(this)];

        return (
            <div>
                <div>{sounds}</div>
                <button onClick={this.fireBalls.bind(this)}>---------FIRE---------</button>
                <div id="scene" />
                <p>alt click to create a cannon, shift click to fire.<br />
                    click to select cannons to move or rotate</p>
                <Sequencer
                    numSteps={16}
                    numTracks={1}
                    callbacks={callbacks}
                />
            </div>
        );
    }
}
export default Scene;