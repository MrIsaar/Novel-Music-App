import React from "react";
import ReactDOM from "react-dom";
import Matter, { Engine, World, Mouse, MouseConstraint } from "matter-js";
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

        this.onCollision = this.onCollision.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.fireBalls = this.fireBalls.bind(this);
    }

    /**
     * initiates Matter.js engine and event handlers
     * 
     */
    componentDidMount() {
        // Create engine
        Tone.start();
        this.engine = Engine.create({
            // positionIterations: 20
        });

        // Create renderer
        this.app = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: 0xadd8e6,
            antialias: true
        });

        // add mouse control
        var mouse = Mouse.create(this.app.view),
            mouseConstraint = MouseConstraint.create(this.engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    },
                    collisionFilter: { group: 0, category: 0, mask: 0 }
                }
            });
        World.add(this.engine.world, mouseConstraint);

        // Set event handlers
        Matter.Events.on(this.engine, "collisionStart", this.onCollision);
        Matter.Events.on(mouseConstraint, "mousedown", this.onMouseDown);
        Matter.Events.on(mouseConstraint, "mousemove", this.onMouseMove);
        Matter.Events.on(mouseConstraint, "mouseup", this.onMouseUp);

        //START Scene Object initialization

        // create inital marbles
        const marbles = [
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

        this.backgroundObjects = [].concat(marbles, walls);

        // Add initialized objects to scene
        this.backgroundObjects.forEach(o => this.addObject(o));
        drums.forEach(d => this.addObject(d));
        cannons.forEach(c => this.addObject(c));

        //END Scene Object initialization

        // Start engine & renderer
        Engine.run(this.engine);
        document.querySelector("#scene").appendChild(this.app.view);
        this.app.ticker.add((delta) => {
            this.backgroundObjects.forEach(o => o.draw());
            cannons.forEach(c => c.draw());
            balls.forEach(b => b.draw());
            drums.forEach(d => d.draw());
            if (selection !== null)
                selection.draw();
        });
    }

    /**
     * Render React HTML and Links Sequencer to scene
     */
    render() {
        sounds.push(<div>
            <ToneExample />
        </div>);

        let callbacks = [this.fireBalls];

        return (
            <div>
                <div>{sounds}</div>
                <button onClick={this.fireBalls}>---------FIRE---------</button>
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

    /**
     *      Handle Collision Interactions
     */
    onCollision(event) {
        for (let i = 0; i < event.pairs.length; i++) {
            for (let j = 0; j < drums.length; j++)
                if (event.pairs[i].bodyA == drums[j].body || event.pairs[i].bodyB == drums[j].body) {
                    console.log("*Meep*");
                    synth.triggerAttackRelease('C4', '8n');
                }
        }

    }

    /**
     *      Mouse down handling
     *
     *      normal click - Select mode
     *      shift click  - Fire marbles from all cannons  - to be removed with sequencer
     *      Alt click    - Create Cannon at location - to be removed with drag and drop
     *
     */
    onMouseDown(event) {
        let position = { x: event.mouse.position.x, y: event.mouse.position.y }

        // shift mode - Fire Cannons - to be removed
        if (event.mouse.sourceEvents.mousedown.shiftKey) {
            for (let i = 0; i < cannons.length; i++) {
                let ball = cannons[i].fireMarble(-1);
                balls.push(ball);
                this.addObject(ball);
            }
            if (selection != null) {
                selection.destroy({ children: true });
                selection = null;
            }
        }

        // alt mode - to be removed with drag and drop
        else if (event.mouse.sourceEvents.mousedown.altKey) {
            Tone.start();
            let cannon = new Cannon(position)//<Cannon pos={position} body={null} />;
            cannons.push(cannon);
            this.addObject(cannon);
            if (selection != null) {
                selection.destroy({ children: true });
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
                    this.app.stage.addChild(selection);
                }
            }
            // update object depending on selection mode
            else {
                if (!selection.handleSelection(position.x, position.y)) {
                    if (selection != null) { // deselect
                        selection.destroy({ children: true });
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
                        this.app.stage.addChild(selection);
                    }
                }
            }
        }
    }

    /**
     *  Handle mouse movement
     *  updates selected body if clicking
     */
    onMouseMove(event) {
        let position = { x: event.mouse.position.x, y: event.mouse.position.y }
        if (event.source.mouse.button > -1 && selection != null) {
            selection.handleSelection(position.x, position.y);
        }
    }

    /**
     * Handle mouse up
     * sets selection mode to none
     */
    onMouseUp(event) {
        let position = { x: event.mouse.position.x, y: event.mouse.position.y }
        if (selection != null) {
            selection.cleanMode();
        }
    }

    /**
     * Fires balls on fire layer
     * fire layer -1 fires all cannons
     * @param {any} fireLayer default -1
     */
    fireBalls(fireLayer = -1) {
        for (let i = 0; i < cannons.length; i++) {
            let ball = cannons[i].fireMarble(-1);
            balls.push(ball);
            this.addObject(ball);
        }
        if (selection != null) {
            Matter.Composite.remove(this.engine.world, selection.bodies)
            selection = null;
        }
    }

    addObject(object) {
        Matter.World.add(this.engine.world, [object.body]);
        this.app.stage.addChild(object);
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
}
export default Scene;