import React from "react";
import Matter, { Engine, World, Mouse, MouseConstraint } from "matter-js";
import Cannon from "./Cannon"
import MTObj from "./MTObj"
import Selection from "./Selection"
import ToneExample from "./ToneSetup"
import * as Tone from 'tone';
import * as PIXI from "pixi.js";
import Instrument from './Instrument';

var synth = new Tone.Synth().toDestination();
const width = 1000;
const height = 500;

export class Scene {
    cannons = [];
    balls = [];
    selection = null;
    selectedTool = "select";
    drums = [];
    sounds = [];

    /**
     * create Scene object
     * @param {any} options
     */
    constructor(options = { objectAdded: () => { }}) {
        Tone.start();

        this.objectAdded = options.objectAdded;

        this.onCollision = this.onCollision.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onBackSpace = this.onBackSpace.bind(this);
        this.fireBalls = this.fireBalls.bind(this);

        this.init();
    }

    /**
     * initiates Matter.js engine and event handlers
     * 
     */
    init() {
        // Create engine
        Tone.start();
        this.engine = Engine.create();

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

        let sceneArea = document.getElementById('_Scene');
       
        /*sceneArea.on('keydown', function (event) {
            //console.log(event.keyCode);
            switch (event.keyCode) {
                case 8:
                case 46:
                    this.onBackSpace();
                    break;

                //....your actions for the keys .....
            }
        });

        sceneArea.focus();*/
        

        // add walls
        World.add(this.engine.world, [
            Matter.Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
            Matter.Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
            Matter.Bodies.rectangle(0, height / 2, 50, height, { isStatic: true })
        ]);

        this.sounds.push(<div> <ToneExample /> </div>);

        // Start engine & renderer
        Engine.run(this.engine);
        this.app.ticker.add((delta) => {
            this.cannons.forEach(c => c.draw());
            this.balls.forEach(b => b.draw());
            this.drums.forEach(d => d.draw());
            if (this.selection !== null)
                this.selection.draw();
        });
    }

    /**
     *      Handle Collision Interactions
     */
    onCollision(event) {
        console.log("collision");
        for (let i = 0; i < event.pairs.length; i++) {
            for (let j = 0; j < this.drums.length; j++) {
                console.log("wtf");
                if (event.pairs[i].bodyA === this.drums[j].body || event.pairs[i].bodyB === this.drums[j].body) {
                    console.log("*Meep*");
                    let sound = this.drums[j].getSound()
                    this.drums[j].synth.triggerAttackRelease(sound.note, sound.length);
                    //synth.triggerAttackRelease(sound.note, sound.length);

                }
            }
        }

    }

    /**
     *      Mouse down handling
     *
     *      normal click - Select mode
     *      
     *      Alt click    - Create Cannon at location - to be removed with drag and drop
     *
     */
    onMouseDown(event) {
        let position = { x: event.mouse.position.x, y: event.mouse.position.y }

        // shift mode - Fire Cannons - to be removed
        if (event.mouse.sourceEvents.mousedown.shiftKey) {
            for (let i = 0; i < this.cannons.length; i++) {
                let ball = this.cannons[i].fireMarble(-1);
                this.balls.push(ball);
                this.addObject(ball);
            }
            if (this.selection != null) {
                this.selection.destroy({ children: true });
                this.selection = null;
            }
            return;
        }

        if (this.selectedTool == "select") {
            // new select object - create new function for this
            if (this.selection == null) {
                let currSelection = null;
                for (let i = 0; i < this.cannons.length && !currSelection; i++) {
                    if (Matter.Bounds.contains(this.cannons[i].body.bounds, position))
                        currSelection = this.cannons[i];
                }
                for (let i = 0; i < this.drums.length && !currSelection; i++) {
                    if (Matter.Bounds.contains(this.drums[i].body.bounds, position))
                        currSelection = this.drums[i];
                }
                if (currSelection != null) {
                    this.selection = new Selection(currSelection);
                    this.app.stage.addChild(this.selection);
                }
            }
            // update object depending on selection mode
            else {
                if (!this.selection.handleSelection(position.x, position.y)) {
                    if (this.selection != null) { // deselect
                        this.selection.destroy({ children: true });
                        this.selection = null;
                    }
                    //Check if another cannon should be selected
                    let currCannon = null;
                    for (let i = 0; i < this.cannons.length; i++) {
                        if (Matter.Bounds.contains(this.cannons[i].body.bounds, position)) {
                            currCannon = this.cannons[i];
                            break;
                        }
                    }
                    if (currCannon != null) {
                        this.selection = new Selection(currCannon);
                        this.app.stage.addChild(this.selection);
                    }
                }
            }
        }

        else if (this.selectedTool == "cannon") {
            Tone.start();
            let cannon = new Cannon(-1, position)//<Cannon pos={position} body={null} />;
            this.cannons.push(cannon);
            this.addObject(cannon);
            if (this.selection != null) {
                this.selection.destroy({ children: true });
                this.selection = null;
            }
        }
        else { // anything else should be a type of instrument
            if (this.selectedTool == 'drum') {
                Tone.start();
                console.log('creating instrument');
                let synthrules = {
                    pitchDecay: 0.008,
                    octaves: 2,
                    envelope: {
                        attack: 0.0006,
                        decay: 0.5,
                        sustain: 0
                    }
                };
                let instrument = new Instrument(-1, position, 1, new Tone.MembraneSynth(synthrules).toDestination(), "Membrane",
                    undefined,
                    [{ x: 30, y: 20 }, { x: 30, y: -10 }, { x: -30, y: -10 }, { x: -30, y: 20 }]
                )//<Cannon pos={position} body={null} />;
                this.drums.push(instrument);
                this.addObject(instrument);
                if (this.selection != null) {
                    this.selection.destroy({ children: true });
                    this.selection = null;
                }
            } else if (this.selectedTool == 'cymbal') {
                Tone.start();
                console.log('creating instrument')
                let synthrules = {
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
                };
                let instrument = new Instrument(-1, position, 1, new Tone.MetalSynth(synthrules).toDestination(), "Metal",
                    { note: 'C2', length: '1n' },
                    [{ x: 10, y: 0 }, { x: 20, y: 5 }, { x: -20, y: 5 }, { x: -10, y: 0 }])
                this.drums.push(instrument);
                this.addObject(instrument);
                if (this.selection != null) {
                    this.selection.destroy({ children: true });
                    this.selection = null;
                }
            } else if (this.selectedTool == 'cowbell') {
                Tone.start();
                let synthrules = {
                    harmonicity: 12,
                    resonance: 800,
                    modulationIndex: 20,
                    envelope: {
                        decay: 0.4,
                    },
                    volume: -15
                };
                let instrument = new Instrument(-1, position, 1, new Tone.MetalSynth(synthrules).toDestination(), "Metal",
                    { note: 'C2', length: '1n' },
                    [{ x: 15, y: 20 }, { x: 10, y: -20 }, { x: -10, y: -20 }, { x: -15, y: 20 }])
                this.drums.push(instrument);
                this.addObject(instrument);
                if (this.selection != null) {
                    this.selection.destroy({ children: true });
                    this.selection = null;
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
        if (event.source.mouse.button > -1 && this.selection != null) {
            this.selection.handleSelection(position.x, position.y);
        }
    }

    /**
     * Handle mouse up
     * sets selection mode to none
     */
    onMouseUp(event) {
        let position = { x: event.mouse.position.x, y: event.mouse.position.y }
        if (this.selection != null) {
            this.selection.cleanMode();
        }
    }

    onBackSpace(event) {
        if (event.key == 'Backspace' || event.key == 'Delete') {
            this.deleteObject(selection != null ? selection.selected : null);
            
        }
        document.getElementById("_Scene").blur();
    }

    /**
     * Fires balls on fire layer
     * fire layer -1 fires all cannons
     * @param {any} fireLayer default -1
     */
    fireBalls(fireLayer = -1) {
        for (let i = 0; i < this.cannons.length; i++) {
            let ball = this.cannons[i].fireMarble(fireLayer);
            if (ball == null)
                continue;
            this.balls.push(ball);

            this.addObject(ball);
        }
        if (this.selection != null) {
            this.selection.destroy();
            this.selection = null;
        }
    }

    addObject(object) {
        Matter.World.add(this.engine.world, [object.body]);
        this.app.stage.addChild(object);
        this.objectAdded();
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
            if (mtObject.MTObjType == "Cannon") {
                //newObject = new Cannon(pos);
                newObject = new Cannon(objectNumber, pos, angle, mtObject.power, mtObject.fireLayer, mtObject.marbleColor, mtObject.marbleSize, mtObject.marbleCollisionFilter, shape, collisionFilter, image);
                this.cannons.push(newObject);
            }
            else if (mtObject.MTObjType === "Instrument") {
                switch (mtObject.synthtype) {
                    case "Membrane":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.MembraneSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "Metal":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.MetalSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "Mono":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.MonoSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "Duo":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.DuoSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "AM":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.AMSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "Noise":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.NoiseSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "Pluck":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.PluckSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "Poly":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.PolySynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    case "Sampler":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.Sampler(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);
                        break;
                    default: //Synth
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.Synth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, image, collisionFilter);


                }
                this.drums.push(newObject);
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
     * Return a list containing every object in the scene.
     * 
     * Does not include temporary simulation objects (e.g. Balls).
     */
    getAllObjects() {
        return this.cannons.concat(this.drums);
    }

    /**
     * removes object from known cannon, ball, or instrument lists
     * returns true if object deleted
     *         false if object not found
     */
    deleteObject(object) { // selected if the 
        //remove with delete
        //remove with backspace
        //remove by drag out of bounds
        if (object == null) {
            console.log("nothing selected, nothing deleted");
            return;
        }
        if (object.MTObjType === "Ball") {

            //short circut because it is the most common deletion
            // always delete oldest ball
            object = balls.shift();
            Matter.World.remove(this.engine.world, object.body);
            object.destroy({ children: true });
            return;

        }
        let index = -1;
        
        try {
             if (object.MTObjType === "Cannon") {
                index = cannons.indexOf(object);
                if (object.objectNumber <= 0) {
                    cannons.pop(index);
                }
                else {
                    http.delete('/creationobject/' + object.objectNumber, { data: this.creationID })
                        .then((res) => {
                            cannons.pop(index);
                            console.log("cannon deleting");
                        });
                }
            } else if (object.MTObjType === "Instrument") {
                index = drums.indexOf(object);
                if (object.objectNumber <= 0) {
                    drums.pop(index);
                }
                else {
                    http.delete('/creationobject/' + object.objectNumber, { data: this.creationID })
                        .then((res) => {
                            drums.pop(index);
                            console.log("drum deleting");

                        });
                }
            } else if (object.MTObjType === "MTObj") {
                index = otherObj.indexOf(object);
                if (object.objectNumber <= 0) {
                    otherObj.pop(index);

                }
                else {
                    http.delete('/creationobject/' + object.objectNumber, { data: this.creationID })
                        .then((res) => {
                            otherObj.pop(index);
                            console.log("other deleting");
                        });
                }
            } else {
                console.log("something is wrong");
            }

            if (selection != null) {
                selection.destroy({ children: true });
                selection = null;
            }
           /* index = this.engine.world.bodies.indexOf(object.body)
            this.engine.world.bodies.pop(index)*/
            Matter.World.remove(this.engine.world,object.body);
            object.destroy({ children: true });
            //console.log("object removed");
        }
        catch (ex) {
            console.log("could not delete object");
            console.log(ex);
        }

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

    saveCreation() {
        allObjects = Array(cannons.length + drums.length + otherObj.length);


        let json = {};
        /* cannons */
        for (let i = 0; i < cannons.length; i++) {
            let creationObj = {};
            json = cannons[i].saveObject();
            creationObj.creationObjectID = undefined;
            creationObj.type = json.MTObjType;
            creationObj.json = json;
            creationObj.creationID = this.creationID;
            allObjects[i] = creationObj;

        }
        /* drums   */
        for (let i = 0; i < drums.length; i++) {
            let creationObj = {};
            json = drums[i].saveObject();
            creationObj.creationObjectID = undefined;
            creationObj.type = json.MTObjType;
            creationObj.json = json;
            creationObj.creationID = this.creationID;
            allObjects[cannons.length + i] = creationObj;

        }
        /* otherObj*/
        for (let i = 0; i < otherObj.length; i++) {
            let creationObj = {};
            json = otherObj[i].saveObject();
            creationObj.creationObjectID = undefined;
            creationObj.type = json.MTObjType;
            creationObj.json = json;
            creationObj.creationID = this.creationID;
            allObjects[cannons.length + otherObj.length + i] = creationObj;

        }

        return allObjects
    }

    saveObjectsToDB = async () => {
        let CreationID = this.creationID;
        let UserID = http.getUserId();
        let AccessLevel = 2;
        //let Creation = this.creationFromDB;
        let allObjectsToSave = this.saveCreation();

        //disable button
        // saveToDBButton
        let savebutton = document.getElementById("saveToDBButton"); 
        let deletebutton = document.getElementById("deleteToDBButton");
        savebutton.disabled = true;
        deletebutton.disabled = true;
        const saveRes = await http.post('/creationObject/save/' + CreationID, { data: allObjectsToSave });
        // store object id in json so next time it is synced
        if (saveRes.length !== allObjectsToSave.length) {
            console.log("Something went wrong with saving");

        }
            
        for (let i = 0; i < saveRes.length; i++) {
            if (allObjectsToSave[i].json.objectNumber !== saveRes[i].creationObjectID && allObjectsToSave[i].type === saveRes[i].type) {
                if (i < cannons.length) {
                    cannons[i].creationObjectID = saveRes[i].creationObjectID;
                }
                else if (i < cannons.length + drums.length ) {
                    drums[i - cannons.length].creationObjectID = saveRes[i].creationObjectID;
                }
                else {
                    otherObj[i - cannons.length - drums.length].creationObjectID = saveRes[i].creationObjectID;
                }
            }
        }

        console.log(`succesfully saved: `);
        console.log(saveRes);
        try {
            let sequencerObj = this.sequencerSavedState;
            sequencerObj.sequencerID = undefined;// DB controller doesnt like if it is defined
            let saveRes = await http.post('/sequencer/save/' + CreationID, { data: sequencerObj });
            console.log(`succesfully saved sequencer`);
            console.log(saveRes);
        } catch (ex) {
            console.log(ex)
        } finally {
            // enable button
            savebutton.disabled = false;
            deletebutton.disabled = false;
        }

    }

} export default Scene;