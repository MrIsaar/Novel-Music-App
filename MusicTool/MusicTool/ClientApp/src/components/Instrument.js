
import Matter from "matter-js";
import MTObj from "./MTObj";
import * as Tone from 'tone';


export class Instrument extends MTObj {

    /**
     * 
     * @param {any} pos
     * @param {any} angle
     * @param {any} image
     * @param {any} sound default to C4, if passed a list it will play list in order
     */
    constructor(objectNumber,pos, angle = 0, synth,synthrules, sound = { note: 'C4', length: '8n' }, shape = [{ x: 20, y: 20 }, { x: 20, y: -20 }, { x: -20, y: -20 }, { x: -20, y: 20 }], image = null, collisionFilter = { group: 0, category: 0xffffffff, mask: 0xffffffff })
    {

        super(objectNumber,pos, angle, shape, collisionFilter, image);
        this.MTObjType = 'Instrument';
        this.synthrules = synthrules;
        this.synth = synth;
        //this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle,render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.body.collisionFilter = collisionFilter;
        this.sound = sound;
        
        
        if (this.sound[0] == undefined) {
            this.noteNumber = -1;
        }
        else {
            this.noteNumber = 0;
        }
        if (image != null) {
            /*this.body.render.sprite = {
                texture: image
            };*/
        }
         

    }

    /**
     * change fireLayer
     * @param {any} newLayer
     */
    updateFirelayer(newLayer) {
        this.fireOn = newLayer;
    }

    /**
     *  Returns matter.js body of this cannon 
     */
    getBody() {
        return this.body;
    }

    /**
     * returns JSON Object of sound with note and length
     */
    getSound() {
        if (this.noteNumber == -1)
            return this.sound;
        else {
            let note = this.sound[this.noteNumber]
            this.noteNumber = (this.noteNumber + 1) % this.sound.length; // update to next note
            return note;
        }
    }

    /**
         changes sound when hit
         can be given a list of sounds 
         @param {any} sound JSON object with 'note' and 'length'
     
     */
    changeSound(sound) {
        this.sound = sound;
        if (this.sound[0] == undefined) {
            this.noteNumber = -1;
        }
        else {
            this.noteNumber = 0;
        }
    }



    /**
     *     firelayer must match fireOn value for cannon
     *     if fire layer is -1 it will always fire
     *     fireOn of -1 will always fire regardless of fireLayer
     * 
     * return ball with current pos, angle, and power of shot 
     * returns null if not fired
     * 
     */
    fireMarble(fireLayer = -1) {
        if (fireLayer != -1 && this.fireOn != -1 && fireLayer != this.fireOn) {
            return null;   // do not fire
        }

        // choose random color of marble
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        let color = "#" + randomColor;
        let rand = Math.random();
        if (rand > 0.6) { color = 'orange' }
        if (this.marbleColor != "rand") {
            color = this.marbleColor;
        }

        //create ball
        var ball = Matter.Bodies.circle(
            this.position.x,
            this.position.y,
            this.marbleSize,
            {
                mass: 10,
                restitution: 1,
                friction: 0.005,
                render: {
                    fillStyle: color
                },
                collisionFilter: { group: -1 }
            });
        //set velocity
        let dv = { x: this.power * Math.cos(this.angle), y: this.power * Math.sin(this.angle) };
        Matter.Body.setVelocity(ball, dv)
        return ball;

    }



    /**
     *  returns a simplified version  JSON object of this object that can be saved
     *  loaded with the loadObject function
     *  
     */
    saveObject() {
        return {
            MTObjType: 'Instrument',
            MTObjVersion: this.MTObjVersion,
            objectNumber: this.objectNumber,
            position: { x: this.position.x, y: this.position.y }, // changes from pixi position to basic json object
            angle: this.angle,
            image: this.image,
            shape: this.shape,
            collisionFilter: this.collisionFilter,
            sound: this.sound,
            synthrules: this.synthrules
        }
    }


    /**
     *  instatiate object based on saved version of this object from saveObject
     *  return the previous body so that it can be removed from the world
     * @param {any} savedJSON
     */
    loadObject(savedJSON) {
        
        if (savedJSON.MTObjType != 'Instrument') {
            throw 'this is not a saved Instrument';
        }
        this.MTObjType = 'Instrument';
        let previousBody = this.body;
        this.shape = savedJSON.shape;
        this.collisionFilter = savedJSON.collisionFilter;
        this.body = Matter.Bodies.fromVertices(savedJSON.position.x, savedJSON.position.y, this.shape, { angle: savedJSON.angle, render: { fillStyle: 'red' }, isStatic: true, collisionFilter: savedJSON.collisionFilter });
        this.updateAngle(savedJSON.angle);
        this.updatePosition(savedJSON.position);
        this.changeCollisionFilter(savedJSON.collisionFilter);
        
        this.image = savedJSON.image;
        this.synthrules = savedJSON.synthrules;
        this.synth = new Tone.MembraneSynth(this.synthrules).toDestination()
        this.sound = savedJSON.sound;
        if (this.sound[0] == undefined) {
            this.noteNumber = -1;
        }
        else {
            this.noteNumber = 0;
        }
        
        return previousBody;

    }
}
export default Instrument;
