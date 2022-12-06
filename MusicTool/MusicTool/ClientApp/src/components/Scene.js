import React from "react";
import Matter, { Engine, World, Mouse, MouseConstraint } from "matter-js";
import Cannon from "./Cannon"
import MTObj from "./MTObj"
import Selection from "./Selection"
import ToneExample from "./ToneSetup"
import * as Tone from 'tone';
import * as PIXI from "pixi.js";
import Instrument from './Instrument';


const width = 1000;
const height = 500;

export class Scene {
    cannons = [];
    balls = [];
    drums = [];
    sounds = [];

    selection = null;
    selectedTool = "select";

    copiedObject = null;

    trajectory = null

    selectedTrack = -1;


    selectedNote = "C2";

    /**
     * create Scene object
     * @param {any} options
     */
    constructor(
        options = {
            objectAdded: () => { },
            selectionUpdate: (selection) => { }
        }
    ) {
        Tone.start();

        this.objectAdded = options.objectAdded;
        this.selectionUpdate = options.selectionUpdate;

        this.onCollision = this.onCollision.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
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
        //World.add(this.engine.world, mouseConstraint);

        // Set event handlers
        Matter.Events.on(this.engine, "collisionStart", this.onCollision);
        Matter.Events.on(mouseConstraint, "mousedown", this.onMouseDown);
        Matter.Events.on(mouseConstraint, "mousemove", this.onMouseMove);
        Matter.Events.on(mouseConstraint, "mouseup", this.onMouseUp);

        //let sceneArea = document.getElementById('_Scene');
       
       
        

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
            if (this.selection !== null) {
                this.selection.draw();

                if (this.selection.selected.MTObjType === 'Cannon') {
                    this.drawTrajectory()
                    document.getElementById('power').value = this.selection.selected.power;
                    
                } else if (this.trajectory !== null) {
                    document.getElementById('power').value = 1;
                    for (let i = 0; i < this.trajectory.length; i++)
                        this.trajectory[i].clear();
                    
                }
            } else if (this.trajectory !== null) {
                document.getElementById('power').value = 1;
                for (let i = 0; i < this.trajectory.length; i++)
                    this.trajectory[i].clear();


            }
        });
    }

    drawTrajectory() {
        // Matter.body.update(body,delta,timescale,correction)
        let scale = { x: 2.9, y: 2.83, g: 1.15 };
        let angleDelta = 0.01;
        let trajectoryPoints = { top: this.selection.selected.getTrajectory(this.engine.world.gravity, { x: scale.x, y: scale.y, g: scale.g, angle: 1 + angleDelta }, 35), bottom: this.selection.selected.getTrajectory(this.engine.world.gravity, { x: scale.x, y: scale.y, g: scale.g, angle: 1 - angleDelta }, 35) };
        let wasNull = false;
        if (this.trajectory === null) {
            this.trajectory = [new PIXI.Graphics(), new PIXI.Graphics()];
            wasNull = true;
        }
        else {
            this.trajectory[0].clear();
            this.trajectory[1].clear();
        }
        for (let j = 0; j < 2; j++) {
            this.trajectory[j].lineStyle(2, 0xadf8e6, 1);
            this.trajectory[j].position.x = this.selection.selected.position.x;
            this.trajectory[j].position.y = this.selection.selected.position.y;

            this.trajectory[j].moveTo(0, 0);

            if (wasNull)
                this.app.stage.addChild(this.trajectory[j]);
        }
        let timePoints = [];
        for (let i = 0; i < trajectoryPoints.top.length; i++) {
            if (i % 8 == 7) {
                timePoints.push(trajectoryPoints.top[i]);
                timePoints.push(trajectoryPoints.bottom[i]);
            }
            
            this.trajectory[0].lineTo(trajectoryPoints.top[i].x, trajectoryPoints.top[i].y);
            this.trajectory[1].lineTo(trajectoryPoints.bottom[i].x, trajectoryPoints.bottom[i].y);
        }

    }

    /**
     *      Handle Collision Interactions
     */
    onCollision(event) {
        console.log("collision");
        for (let i = 0; i < event.pairs.length; i++) {
            for (let j = 0; j < this.drums.length; j++) {
                if (event.pairs[i].bodyA === this.drums[j].body || event.pairs[i].bodyB === this.drums[j].body) {
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
            this.deselectObject();
            return;
        }

        if (this.selectedTool == "select") {
            // new select object - create new function for this
            if (this.selection == null) {
                let currSelection = null;
                for (let i = 0; i < this.cannons.length && !currSelection; i++) {
                    if (Matter.Bounds.contains(this.cannons[i].body.bounds, position)) {
                        currSelection = this.cannons[i];
                    }
                        
                }
                for (let i = 0; i < this.drums.length && !currSelection; i++) {
                    if (Matter.Bounds.contains(this.drums[i].body.bounds, position)) {
                        currSelection = this.drums[i];
                    }
                        
                }
                if (currSelection != null) {
                    this.selectObject(currSelection);
                }
            }
            // update object depending on selection mode
            else {
                if (!this.selection.handleSelection(position.x, position.y)) {
                    if (this.selection != null) { // deselect
                        this.deselectObject();
                        if (this.trajectory !== null) {
                            document.getElementById('power').value = 1;

                            for (let i = 0; i < this.trajectory.length; i++)
                                this.trajectory[i].clear();
                        }
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
                        this.selectObject(currCannon);
                    }
                }
            }
        }

        else if (this.selectedTool == "cannon") {
            Tone.start();
            let cannon = new Cannon(-1, position, 0, 20, this.selectedTrack, this.engine.gravity);//<Cannon pos={position} body={null} />;
            this.cannons.push(cannon);
            this.addObject(cannon);
            this.deselectObject();
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
                let instrument = new Instrument(-1, position, 0, new Tone.MembraneSynth(synthrules).toDestination(), "Membrane",
                    undefined,
                    [{ x: 30, y: 20 }, { x: 30, y: -10 }, { x: -30, y: -10 }, { x: -30, y: 20 }],
                    'green'
                )//<Cannon pos={position} body={null} />;
                this.drums.push(instrument);
                this.addObject(instrument);
                this.deselectObject();
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
                let instrument = new Instrument(-1, position, 0, new Tone.MetalSynth(synthrules).toDestination(), "Metal",
                    { note: document.getElementById("notes").value, length: '1n' },
                    [{ x: 10, y: 0 }, { x: 20, y: 5 }, { x: -20, y: 5 }, { x: -10, y: 0 }], 'orange')
                this.drums.push(instrument);
                this.addObject(instrument);
                this.deselectObject();
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
                let instrument = new Instrument(-1, position, 0, new Tone.MetalSynth(synthrules).toDestination(), "Metal",
                    { note: document.getElementById("notes").value, length: '1n' },
                    [{ x: 15, y: 20 }, { x: 10, y: -20 }, { x: -10, y: -20 }, { x: -15, y: 20 }], 'grey')
                this.drums.push(instrument);
                this.addObject(instrument);
                this.deselectObject();
            }
            else if (this.selectedTool == 'electronic') {
                Tone.start();
                let synthrules = {
                    portamento: 0.01
                    
                };
                let instrument = new Instrument(-1, position, 0, new Tone.Synth(synthrules).toDestination(), "Synth",
                    { note: document.getElementById("notes").value, length: '8n' },
                    [{ x: -10, y: 10 }, { x: 10, y: 10 }, { x: 30, y: -5 }, { x: 25, y: -15 }, { x: -25, y: -15 }, { x: -30, y: -5 }], 'blue')
                this.drums.push(instrument);
                this.addObject(instrument);
                this.deselectObject();
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
            if (this.selection.handleSelection(position.x, position.y))
                this.selectionUpdate(this.selection);
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
        this.deselectObject();
    }

    selectObject(obj) {
        this.selection = new Selection(obj, 100, this.selectionUpdate );
        this.app.stage.addChild(this.selection);
        this.selectionUpdate(this.selection);
    }

    deselectObject() {
        if (this.selection === null) return;

        this.selection.destroy();
        this.selection = null;
        this.selectionUpdate(this.selection);
    }

    /**
     * change the value of gravity,  
     **/
    updateGravity(y = 1, x = 0) {
        
        this.engine.world.gravity.x = x;
        this.engine.world.gravity.y = y;
        
    }

    getGravity() {
        return this.engine.world.gravity;
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
            let color = mtObject.color;
            let collisionFilter = mtObject.collisionFilter;
            let image = mtObject.image;

            // create temp object to load object into
            if (mtObject.MTObjType == "Cannon") {
                //newObject = new Cannon(pos);
                newObject = new Cannon(objectNumber, pos, angle, mtObject.power, mtObject.fireLayer, this.engine.gravity, mtObject.marbleColor, mtObject.marbleSize, mtObject.marbleCollisionFilter, shape, collisionFilter, image);
                this.cannons.push(newObject);
            }
            else if (mtObject.MTObjType === "Instrument") {
                switch (mtObject.synthtype) {
                    case "Membrane":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.MembraneSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "Metal":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.MetalSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "Mono":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.MonoSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "Duo":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.DuoSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "AM":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.AMSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "Noise":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.NoiseSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "Pluck":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.PluckSynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "Poly":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.PolySynth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    case "Sampler":
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.Sampler(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);
                        break;
                    default: //Synth
                        newObject = new Instrument(objectNumber, pos, angle, new Tone.Synth(mtObject.synthrules).toDestination(), mtObject.synthtype, mtObject.sound, shape, color, image, collisionFilter);


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
    getAllObjects(creationID) {
        let allObjects = this.cannons.concat(this.drums);
       
        let json = {};
        /* cannons */
        for (let i = 0; i < allObjects.length; i++) {

            let creationObj = {};
            json = allObjects[i].saveObject();
            creationObj.creationObjectID = undefined;
            creationObj.type = json.MTObjType;
            creationObj.json = json;
            creationObj.creationID = creationID;
            allObjects[i] = creationObj;
        }
        return allObjects;
    }

    

} export default Scene;