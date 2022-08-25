import React from "react";
import Matter, { Engine, World, Mouse, MouseConstraint } from "matter-js";
import Cannon from "./Cannon"
import Selection from "./Selection"
import ToneExample from "./ToneSetup"
import * as Tone from 'tone';
import { Sequencer } from './Sequencer';
import MTObj from "./MTObj";

import { Rect, Circle } from "./ShapePrimitives";
import * as PIXI from "pixi.js";

import Instrument from './Instrument';


var cannons = [];
var balls = [];
var selection = null;
var drums = [];
var sounds = [];
var otherObj = [];
var synth = new Tone.Synth().toDestination();
const width = 1000;
const height = 500;
var debugLoad = true;
var noteList = [{ note: 'A3', length: '8n' }, { note: 'B3', length: '8n' }, { note: 'C4', length: '8n' }, { note: 'D4', length: '8n' }, { note: 'E4', length: '8n' }, { note: 'F4', length: '8n' }, { note: 'G4', length: '8n' }]
let savedObject = { "MTObjType": "Instrument","MTObjVersion": "0.9.0","pos": {"x": 300,"y": 250},"angle": 0,"image": "./PalletImages/1.png","shape": [ {"x": -25,  "y": -10  }, {"x": 25,  "y": -10  }, {"x": 20,  "y": 10  }, {"x": -20,  "y": 10  } ],"collisionFilter": {  "group": 0, "category": 0xFFFFFFFF, "mask": 0xFFFFFFFF },"sound": [  {"note": "A3",  "length": "8n"  }, {"note": "B3",  "length": "8n"  }, {"note": "C4",  "length": "8n"  } ]};

export class Scene extends React.Component {

    /**
     * create Scene object
     * @param {any} props
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sequencerData: {}
        };
        Tone.start();

        this.onCollision = this.onCollision.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.fireBalls = this.fireBalls.bind(this);

        let { creationID } = this.props.match.params;
        this.creationID = creationID;
    }

    /**
     * initiates Matter.js engine and event handlers
     * 
     */
    componentDidMount() {
        if (this.creationID) {
            this.loadCreation();
        }
        
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

        
        let savedObject = { 
            "MTObjType": "Instrument",
            "MTObjVersion": "0.9.0",
            "pos": {
                "x": 300,
                "y": 250
            },
            "angle": 0,
            "image": "./PalletImages/1.png",
            "shape": [
                {
                    "x": -25,
                    "y": -10
                },
                {
                    "x": 25,
                    "y": -10
                },
                {
                    "x": 20,
                    "y": 10
                },
                {
                    "x": -20,
                    "y": 10
                }
            ],
            "collisionFilter": {
                "group": 0,
                "category": 0xFFFFFFFF,
                "mask": 0xFFFFFFFF
            },
            "sound": [
                {
                    "note": "A3",
                    "length": "8n"
                },
                {
                    "note": "B3",
                    "length": "8n"
                },
                {
                    "note": "C4",
                    "length": "8n"
                }
            ]
        };

        /**
         *      Handle Collision Interactions
         */
        Matter.Events.on(this.engine, "collisionStart",
            function (event) {
                for (let i = 0; i < event.pairs.length; i++) {
                    for (let j = 0; j < drums.length; j++)
                        if (event.pairs[i].bodyA == drums[j].body || event.pairs[i].bodyB == drums[j].body) {
                            console.log("*Meep*");
                            let sound = drums[j].getSound()
                            synth.triggerAttackRelease(sound.note, sound.length);
                            if (debugLoad) {
                                debugLoad = false;
                                let oldBody = drums[j].loadObject(savedObject);
                                
                                Matter.Composite.remove(this.engine.world, oldBody);
                                Matter.World.add(this.engine.world, drums[j].body);
                            }
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
                    /* World.add(this.engine.world, [ball]);*/
                    for (let i = 0; i < cannons.length; i++) {
                        let ball = cannons[i].fireMarble(-1);
                        balls.push(ball);
                        World.add(this.engine.world, [ball]);
                    }
                    if (selection != null) {
                        Matter.Composite.remove(this.engine.world, selection.bodies)
                        selection = null;
                    }
                }

                // alt mode - to be removed with drag and drop
                else if (event.mouse.sourceEvents.mousedown.altKey) {
                    Tone.start();
                    let position = { x: event.mouse.position.x, y: event.mouse.position.y }

                    let cannon = new Cannon(position)//<Cannon pos={position} body={null} />;
                    cannons.push(cannon);
                    World.add(this.engine.world, cannon.getBody());
                    //World.add(this.engine.world, Bodies.circle(event.mouse.position.x, event.mouse.position.y, 30, { restitution: 0.7 }));
                    if (selection != null) {
                        Matter.Composite.remove(this.engine.world, selection.bodies)
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
                            World.add(this.engine.world, selection.bodies);
                        }

                    }
                    // update object depending on selection mode
                    else {
                        if (!selection.handleSelection(position.x, position.y)) {
                            if (selection != null) { // deselect
                                Matter.Composite.remove(this.engine.world, selection.bodies)
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
                                World.add(this.engine.world, selection.bodies);
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





        // Set event handlers
        Matter.Events.on(this.engine, "collisionStart", this.onCollision);
        Matter.Events.on(mouseConstraint, "mousedown", this.onMouseDown);
        Matter.Events.on(mouseConstraint, "mousemove", this.onMouseMove);
        Matter.Events.on(mouseConstraint, "mouseup", this.onMouseUp);

        //START Scene Object initialization



        // add walls
        World.add(this.engine.world, [
            // walls
            Matter.Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
            Matter.Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
            //Bodies.rectangle(width / 2, height / 2, 50, height, { isStatic: true }),
            Matter.Bodies.rectangle(0, height / 2, 50, height, { isStatic: true })
        ]);




        // create initial cannons
        let position = { x: width * (0.7), y: height * 0.3 };
        let cannon;/*= new Cannon(position)//<Cannon pos={position} body={null} />;
        cannons.push(cannon);
        position = { x: width * (0.2), y: height * 0.3 };
        cannon = new Cannon(position, 1)//<Cannon pos={position} body={null} />;*/


        for (let i = 1; i < 5; i++) {
            position = { x: width * (0.2), y: height * (0.2 * i) };
            cannon = new Cannon(position, 0, 20, i);
            cannons.push(cannon);
            
        }
        for (let i = 1; i < 5; i++) {
            /*drums.push(Bodies.rectangle(width * (0.4), height * (0.2 * i) + 45 , 50, 20, {
                isStatic: true,
                render: {
                    fillStyle: "red"
                }
            }))*/
            position = { x: width * (0.4), y: height * (0.2 * i) + 50 };
            let drum = new Instrument(position, 0, noteList[5-i], [{ x: 20, y: 10 }, { x: 25, y: -10 }, { x: -25, y: -10 }, { x: -20, y: 10 }]);
            drums.push(drum);
            Matter.World.add(this.engine.world, drum.body);

        }
        position = { x: width * (0.1), y: height * (0.2) + 50 };
        let drum = new Instrument(position, 0, [noteList[0], noteList[1], noteList[2]], [{ x: 20, y: 10 }, { x: 25, y: -10 }, { x: -25, y: -10 }, { x: -20, y: 10 }], './PalletImages/1.png');
        drums.push(drum);
        World.add(this.engine.world, drum.body);
        //   flip top cannon to this  angle:2.9158123171809476, dx:-173.4000015258789, dy:39.8125
        //   tune 0-0- ---- 00-- ----


        for (let i = 0; i < cannons.length; i++) {
            Matter.World.add(this.engine.world, cannons[i].getBody());
        }


        // create inital marbles
        /*var ballA = Bodies.circle(210, 100, 30, { restitution: 0.8 });
        var ballB = Bodies.circle(110, 50, 30, { restitution: 0.8 });
        World.add(this.engine.world, [ballA, ballB]);*/


        //this.backgroundObjects = [].concat(marbles, walls);

        // Add initialized objects to scene
        //this.backgroundObjects.forEach(o => this.addObject(o));
        drums.forEach(d => this.addObject(d));
        cannons.forEach(c => this.addObject(c));

        //END Scene Object initialization

        sounds.push(<div> <ToneExample /> </div>);


        // Start engine & renderer
        Engine.run(this.engine);
        document.querySelector("#scene").appendChild(this.app.view);
        this.app.ticker.add((delta) => {
            //this.backgroundObjects.forEach(o => o.draw());
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
        //let callbacks = [this.fireBalls];
        
        /*sounds.push(<div>            <ToneExample />        </div>);*/
        //let callbacks = [this.fireBalls.bind(this)];
        let callback = (id) => this.fireBalls.bind(this)(id);
        //let callback = this.fireBalls;

        let sequencer;
        if (this.state.loading) {
            sequencer = <h1>Loading...</h1>;
        } else {
            sequencer =
                <Sequencer
                    savedState={this.sequencerSavedState}
                    loading={this.state.loading}
                    callback={callback}
                />
        }
       
        return (
            <div id="_Scene" >
                <div ref="scene" id="scene" />
                <div className="row">
                    <div className="col-3"><ToneExample /> </div>
                    <div className="col-3">
                        <button onClick={this.fireBalls.bind(this)}>---------FIRE---------</button>
                    </div>
                   
                </div>
                <p>alt click to create a cannon, shift click to fire.<br />
                    click to select cannons to move or rotate</p>
                {sequencer}
            </div>
        );
    }

    /**
     *      Handle Collision Interactions
     */
    onCollision(event) {
        for (let i = 0; i < event.pairs.length; i++) {
            for (let j = 0; j < drums.length; j++)
                if (event.pairs[i].bodyA === drums[j].body || event.pairs[i].bodyB === drums[j].body) {
                    console.log("*Meep*");
                    let sound = drums[j].getSound()
                    synth.triggerAttackRelease(sound.note, sound.length);
                    // if (debugLoad) {
                    //     debugLoad = false;
                    //     let oldBody = drums[j].loadObject(savedObject);
                        
                    //     Matter.Composite.remove(this.engine.world, oldBody);
                    //     Matter.World.add(this.engine.world, drums[j].body);
                    // }
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
                let currSelection = null;
                for (let i = 0; i < cannons.length; i++) {
                    if (Matter.Bounds.contains(cannons[i].body.bounds, position)) {
                        currSelection = cannons[i];
                        break;
                    }
                    if (Matter.Bounds.contains(drums[i].body.bounds, position)) {
                        currSelection = drums[i];
                        break;
                    }
                }
                if (currSelection != null) {
                    selection = new Selection(currSelection);
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
            let ball = cannons[i].fireMarble(fireLayer);
            if (ball == null)
                continue;
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
     * load an MTObj from json saved object into world
     * @param {any} mtObject music tool object that inherits from MTObj
     */
    loadObject(mtObject) {
        try {
            var newObject = null;
            let pos = { x: 0, y: 0 };

            // create temp object to load object into
            if (mtObject.MTObjType == "MTObj") {
                newObject = new MTObj(pos);
                otherObj.push(newObject);
            } 
            else if (mtObject.MTObjType == "Cannon") {
                newObject = new Cannon(pos);
                cannons.push(newObject);
            }
            else if (mtObject.MTObjType == "Instrument") {
                newObject = new Instrument(pos);
                drums.push(newObject);
            }
            else {
                console.log("unknown type");
                return;
            }

            //load json
            newObject.loadObject(mtObject);
            this.addObject(newObject
            )
        }
        catch (exception_var) {
            console.log("could not load object");
        }
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

    loadCreation() {
        fetch('/api/Creations/' + this.creationID)
            .then(res => res.json())
            .then(data => {
                console.log("creation data: ", data);
                this.sequencerSavedState = data.sequencer;
                this.setState({
                    loading: false,
                    sequencerData: data.sequencer
                });
            });
    }
}
export default Scene;