import React from "react";
import Matter, { Engine, World, Mouse, MouseConstraint } from "matter-js";
import Cannon from "./Cannon"
import MTObj from "./MTObj"
import Selection from "./Selection"
import ToneExample from "./ToneSetup"
import * as Tone from 'tone';
import { Sequencer } from './Sequencer';
import http from '../httpFetch';
import { Rect, Circle } from "./ShapePrimitives";
import * as PIXI from "pixi.js";

import Instrument from './Instrument';
import Toolbar from './Toolbar'



var cannons = [];
var balls = [];
var selection = null;
var drums = [];
var sounds = [];
var otherObj = [];
var allObjects = [];



var synth = new Tone.Synth().toDestination();
const width = 1000;
const height = 500;
var debugLoad = true;
var noteList = [{ note: 'A3', length: '8n' }, { note: 'B3', length: '8n' }, { note: 'C4', length: '8n' }, { note: 'D4', length: '8n' }, { note: 'E4', length: '8n' }, { note: 'F4', length: '8n' }, { note: 'G4', length: '8n' }]
let savedObject = { "MTObjType": "Instrument", "MTObjVersion": "0.9.0", "pos": { "x": 300, "y": 250 }, "angle": 0, "image": "./PalletImages/1.png", "shape": [{ "x": -25, "y": -10 }, { "x": 25, "y": -10 }, { "x": 20, "y": 10 }, { "x": -20, "y": 10 }], "collisionFilter": { "group": 0, "category": 0xFFFFFFFF, "mask": 0xFFFFFFFF }, "sound": [{ "note": "A3", "length": "8n" }, { "note": "B3", "length": "8n" }, { "note": "C4", "length": "8n" }] };


export class Scene extends React.Component {

    /**
     * create Scene object
     * @param {any} props
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sequencerData: {},
            selectedTool: 'select'
        };
        Tone.start();

        this.onCollision = this.onCollision.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.fireBalls = this.fireBalls.bind(this);

        let { creationID } = this.props.match.params;
        this.creationID = creationID;

        this.creationFromDB = null;
    }

    setSelectedTool(tool) {
        this.setState({ selectedTool: tool });
        console.log(`Selected Tool: ${tool}`)
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
                <Toolbar
                    onChange={this.setSelectedTool.bind(this)}
                    value={this.state.selectedTool}
                ></Toolbar>
                <div ref="scene" id="scene" />
                <div className="row">
                    <div className="col-3"><ToneExample /> </div>
                    <div className="col-3">
                        <button onClick={this.fireBalls.bind(this)}>------FIRE------</button>
                        <button onClick={this.handleSave}>------SAVE------</button>
                        <button onClick={this.saveObjectsToDB}>------SAVE-Object------</button>
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
        console.log("collision");
        for (let i = 0; i < event.pairs.length; i++) {
            for (let j = 0; j < drums.length; j++) {
                console.log("wtf");
                if (event.pairs[i].bodyA === drums[j].body || event.pairs[i].bodyB === drums[j].body) {
                    console.log("*Meep*");
                    let sound = drums[j].getSound()
                    drums[j].synth.triggerAttackRelease(sound.note, sound.length);
                    //synth.triggerAttackRelease(sound.note, sound.length);

                }
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
            return;
        }

        if (this.state.selectedTool == "select") {
            // new select object - create new function for this
            if (selection == null) {
                let currSelection = null;
                for (let i = 0; i < cannons.length && !currSelection; i++) {
                    if (Matter.Bounds.contains(cannons[i].body.bounds, position))
                        currSelection = cannons[i];
                }
                for (let i = 0; i < drums.length && !currSelection; i++) {
                    if (Matter.Bounds.contains(drums[i].body.bounds, position))
                        currSelection = drums[i];
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

        else if (this.state.selectedTool == "cannon") {
            Tone.start();
            let cannon = new Cannon(-1, position)//<Cannon pos={position} body={null} />;
            cannons.push(cannon);
            this.addObject(cannon);
            if (selection != null) {
                selection.destroy({ children: true });
                selection = null;
            }
        }
        else { // anything else should be a type of instrument
            if (this.state.selectedTool == 'drum') {
                Tone.start();
                console.log('creating instrument')
                let instrument = new Instrument(-1, position, 1, new Tone.MembraneSynth({
                    pitchDecay: 0.008,
                    octaves: 2,
                    envelope: {
                        attack: 0.0006,
                        decay: 0.5,
                        sustain: 0
                    }
                }).toDestination(),
                    undefined,
                    [{ x: 30, y: 20 }, { x: 30, y: -10 }, { x: -30, y: -10 }, { x: -30, y: 20 }]
                )//<Cannon pos={position} body={null} />;
                drums.push(instrument);
                this.addObject(instrument);
                if (selection != null) {
                    selection.destroy({ children: true });
                    selection = null;
                }
            } else if (this.state.selectedTool == 'cymbal') {
                Tone.start();
                console.log('creating instrument')
                let instrument = new Instrument(-1, position, 1, new Tone.MetalSynth({
                    frequency: 200,
                    envelope: {
                        attack: 0.0001,
                        decay: 1.4,
                        release: 0.2
                    },
                    harmonicity: 10,
                    modulationIndex: 32,
                    resonance: 4000,
                    octaves: 1.5
                }).toDestination(),
                    { note: 'C2', length: '1n' },
                    [{ x: 10, y: 0 }, { x: 20, y: 5 }, { x: -20, y: 5 }, { x: -10, y: 0 }])
                drums.push(instrument);
                this.addObject(instrument);
                if (selection != null) {
                    selection.destroy({ children: true });
                    selection = null;
                }
            } else if (this.state.selectedTool == 'cowbell') {
                Tone.start();
                let instrument = new Instrument(-1, position, 1, new Tone.MetalSynth({
                    harmonicity: 12,
                    resonance: 800,
                    modulationIndex: 20,
                    envelope: {
                        decay: 0.4,
                    },
                    volume: -15
                }).toDestination(),
                    { note: 'C2', length: '1n' },
                    [{ x: 15, y: 20 }, { x: 10, y: -20 }, { x: -10, y: -20 }, { x: -15, y: 20 }])
                drums.push(instrument);
                this.addObject(instrument);
                if (selection != null) {
                    selection.destroy({ children: true });
                    selection = null;
                }
            }
        }

        // default back to the select tool
        this.setState({ selectedTool: "select" })
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
        if (selection != null && selection.bodies != undefined) {
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
    loadObject(objectNumber, mtObject) {
        try {
            var newObject = null;

            let pos = mtObject.position;
            let angle = mtObject.angle;
            let shape = mtObject.shape;
            let collisionFilter = mtObject.collisionFilter;
            let image = mtObject.image;

            // create temp object to load object into
            if (mtObject.MTObjType == "MTObj") {
                newObject = new MTObj(objectNumber, pos, angle, shape, collisionFilter, image);
                otherObj.push(newObject);
            }
            else if (mtObject.MTObjType == "Cannon") {
                //newObject = new Cannon(pos);
                newObject = new Cannon(objectNumber, pos, angle, mtObject.power, mtObject.fireLayer, mtObject.marbleColor, mtObject.marbleSize, mtObject.marbleCollisionFilter, shape, collisionFilter, image);
                cannons.push(newObject);
            }
            else if (mtObject.MTObjType == "Instrument") {
                newObject = new Instrument(objectNumber, pos, angle, mtObject.sound, shape, image, collisionFilter);
                drums.push(newObject);
            }
            else {
                console.log("unknown type");
                return;
            }

            //load json
            //newObject.loadObject(mtObject);
            this.addObject(newObject)
        }
        catch (exception_var) {
            console.log("could not load object");
            console.log(exception_var);
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
            //fetch('/api/Creations/' + 1)
            .then(res => res.json())
            .then(data => {
                console.log("creation data: ", data);
                console.log("object list: ", data.creationObject);
                for (let i = 0; i < data.creationObject.length; i++) {
                    console.log(`DB obj Saved cannon ${i}: `, data.creationObject[i]);
                    console.log(`DB Saved MTObj cannon ${i}: `, data.creationObject[i].json);
                    console.log(`DB Saved MTObj.type cannon ${i}: `, data.creationObject[i].json.MTObjType);
                    console.log(`DB Saved MTObj.position cannon ${i}: `, data.creationObject[i].json.position);
                    console.log(`DB Saved MTObj.angle cannon ${i}: `, data.creationObject[i].json.angle);
                    this.loadObject(data.creationObject[i].creationObjectID, data.creationObject[i].json);
                }
                this.creationFromDB = data;
                this.sequencerSavedState = data.sequencer;
                this.setState({
                    loading: false,
                    sequencerData: data.sequencer
                });

                //this.loadObjects(data.creationObject);
            });


    }

    /*loadObjects(objs) {
        for (let i = 0; i < objs.length; i++) {
            this.loadObject(objs[i]);
        }
    } */

    saveCreation() {
        allObjects = [];
        /* cannons */
        for (let i = 0; i < cannons.length; i++) {
            //cannons[i].savedObject();
            allObjects.push(cannons[i]);
        }
        /* drums   */
        for (let i = 0; i < drums.length; i++) {
            allObjects.push(drums[i]);
        }
        
        /* otherObj*/
        for (let i = 0; i < otherObj.length; i++) {
            allObjects.push(otherObj[i]);
        }
        /* sounds  */
        /*for (let i = 0; i < sounds.length; i++) {

        }*/
        /* synth   */
        /*for (let i = 0; i < synth.length; i++) {

        }*/
        return allObjects
    }

    handleSave = async () => {
        let CreationID = this.creationID;
        let UserID = http.getUserId();
        let AccessLevel = 2;
        let Creation = this.creationFromDB;

        try {
            // Should store access before creation!
            // save access
            const res = await http.post('/access/save/' + CreationID, { data: { CreationID, UserID: `${UserID}`, AccessLevel, Creation } })
            // TODO: other db save post here are samples for saving creation, creationobject and sequencer
            // CHECK Postman for more details on JSON_string <- MUST be in type of string

            // save creations
            // e.g.string JSON = "name": "TestCreation3","worldRules": {"gravity": 1,"background": "blue"},"creationDate": .... ...., "creationID": 3
            // await http.post('/creations/save/' + CreationID, { data: { CreationID, JSON_string })

            // e.g. string JSON = "json": {"tracks": [{"name": "track1","notes": [true,true,true,false,false,false]},{"name": "track2","notes": [true,false,false,true,false,false]}]},"creationID": 2
            // await http.post('/sequencer/save/' + CreationID, { data: { CreationID, JSON_string} })

            // e.g. string JSON = "json": {"type": "drum","x": 0,"y": 0,"radius": 10,"color": "green"},"type": "drum","creationID": 4
            // json = '{ "MTObjType": "Cannon", "MTObjVersion": "1.0.0","objectNumber":"2", "position": { "x": 300, "y": 150 }, "angle": 2, "image": null, "shape": [ { "x": -20, "y": -10 }, { "x": 70, "y": 0 }, { "x": -20, "y": 10 }, { "x": -40, "y": 0 } ], "collisionFilter": { "group": 0, "category": 0, "mask": 0 }, "fireLayer": 1, "power": 20, "marbleSize": 20, "marbleColor": "rand", "marbleCollisionFilter": { "group": -1, "category": 4294967295, "mask": 4294967295 } }';

            console.log(res);
            console.log('save access successful');
        } catch (ex) {
            console.log(ex)
        }

        // .then((res) => {
        //     console.log(res);
        //     console.log('save access successful');
        // }).catch((ex) => {
        //     console.log('not successful')
        // })
    }





    saveObjectsToDB = async () => {
        let CreationID = this.creationID;
        let UserID = http.getUserId();
        let AccessLevel = 2;
        let Creation = this.creationFromDB;
        let allObjectsToSave = this.saveCreation();
        for (let i = 0; i < allObjectsToSave.length; i++) {
            if (allObjectsToSave[i].objectNumber > 0)
                continue; //TODO: REMOVE TO ENABLE ALL SAVE
            try {


                let json = cannons[i].saveObject();
                /*json.shape = [{ "x": -20, "y": -10 }, { "x": 70, "y": 0 }, { "x": -20, "y": 10 }, { "x": -40, "y": 0 }];
                json.angle = 2;
                json.objectNumber = 10;
                json.position = { "x": 300, "y": 150 };*/

                let MTObjType = json.MTObjType;
                let Id = json.objectNumber;
                let creationObj = {};
                //console.log(creationObj);
                creationObj.creationObjectID = undefined;
                creationObj.type = MTObjType;
                creationObj.json = json;
                creationObj.creationID = CreationID;
                //console.log(creationObj);
                const saveRes = await http.post('/creationObject/save/' + CreationID, { data: creationObj });
                // store object id in json so next time it is synced
                if (saveRes.creationObjectID != Id) {

                    cannons[i].objectNumber = saveRes.creationObjectID;
                }

                console.log(saveRes);

            } catch (ex) {
                console.log(ex)
            }
        }
    }

} export default Scene;