import * as PIXI from "pixi.js";
import { Circle } from "./ShapePrimitives";
import Matter from "matter-js";
import MTObj from "./MTObj";
import Ball from "./Ball";

// Cannon rendering constants
const CANNON_COLOR = 0xff0000;
const CANNON_SHAPE = [{ x: -20, y: 20 }, { x: 40, y: 0 }, { x: -20, y: -20 }, { x: -30, y: 0 }];


 export class Cannon extends MTObj  {


    /**
     * creates a cannon at specified position with angle.
     * 
     * @param {any} pos    {x, y}
     * @param {any} angle angle in radians
     * @param {any} power default 20 how fast marbles will be shot
     * @param {any} fireLayer default -1, if -1 then always fires
     * @param {any} marbleColor HTML recognized color, random is default
     * @param {any} marbleSize default 20
     * @param {any} marbleCollisionFilter default is all
     */
     constructor(objectNumber, pos, angle = 0, power = 20, fireLayer = -1, marbleColor = "rand", marbleSize = 20, marbleCollisionFilter = { group: -1, category: 0xFFFFFFFF, mask: 0xFFFFFFFF }, shape = CANNON_SHAPE, collisionFilter = { group: 0, category: 0, mask: 0 }, image = null) {

        
         super(objectNumber,pos, angle, shape, collisionFilter, image)
        
        // body created in super MTObj
        //this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle,render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.fireOn = fireLayer
        
        this.rotation = angle;

        this.power = power;
        this.marbleSize = marbleSize;
        this.marbleColor = marbleColor;
        this.MTObjType = 'Cannon';
        
        this.marbleCollisionFilter = marbleCollisionFilter;
      
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
     *     firelayer must match fireOn value for cannon
     *     if fire layer is -1 it will always fire
     *     fireOn of -1 will always fire regardless of fireLayer
     * 
     * return ball with current pos, angle, and power of shot 
     * returns null if not fired
     * 
     */
    fireMarble(fireLayer = -1) {
        if (fireLayer !== -1 && this.fireOn != -1 && fireLayer != this.fireOn) {
            return null;   // do not fire
        }

        // choose random color of marble
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        let color = "#" + randomColor;
        let rand = Math.random();
        if (rand > 0.6) { color = 'orange' }
        if (this.marbleColor !== "rand") {
            color = this.marbleColor;
        }

        //create ball
       /* var ball = Matter.Bodies.circle(
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
                collisionFilter: this.marbleCollisionFilter
            });*/
        var ball = new Ball(this.position, this.marbleSize, this.marbleCollisionFilter,this.fireLayer,color);

        //set velocity
        let dv = { x: this.power * Math.cos(this.rotation), y: this.power * Math.sin(this.rotation) };
        console.log(`dv: ${dv.x} pox: ${ball.body.position.x}`)
         Matter.Body.setVelocity(ball.body, dv)
         return ball;


     }

    /**
    *  returns a simplified version  JSON object of this object that can be saved
    *  loaded with the loadObject function
    *  
    */
    saveObject() {
        return {
            MTObjType: 'Cannon',
            MTObjVersion: this.MTObjVersion,
            objectNumber: this.objectNumber,
            position: { x: this.position.x, y: this.position.y }, // changes from pixi position to basic json object
            angle: (this.angle % 360.0) * (3.141592 / 180),
            image: this.image,
            shape: this.shape,
            collisionFilter: this.collisionFilter,
            fireLayer: this.fireOn,
            power: this.power,
            marbleSize: this.marbleSize,
            marbleColor: this.marbleColor,
            marbleCollisionFilter: this.marbleCollisionFilter
        }
    }


    /**
     *  instatiate object based on saved version of this object from saveObject
     *  return the previous body so that it can be removed from the world
     * @param {any} savedJSON
     */
    loadObject(savedJSON) {
        if (savedJSON.MTObjType != 'Cannon') {
            throw 'this is not a saved Cannon';
        }
        this.MTObjType = 'Cannon';
        this.MTObjVersion = savedJSON.MTObjVersion;
        let previousBody = this.body;
        this.shape = savedJSON.shape;
        this.collisionFilter = savedJSON.collisionFilter;
        this.body = Matter.Bodies.fromVertices(savedJSON.position.x, savedJSON.position.y, this.shape, { angle: savedJSON.angle, render: { fillStyle: 'red' }, isStatic: true, collisionFilter: savedJSON.collisionFilter });
        this.position = savedJSON.position;
        this.angle = savedJSON.angle;
        this.image = savedJSON.image;
        this.fireOn = savedJSON.fireLayer;
        this.power = savedJSON.power;
        this.marbleSize = savedJSON.marbleSize;
        this.marbleColor = savedJSON.marbleColor;
        this.marbleCollisionFilter = savedJSON.marbleCollisionFilter;
        
        return previousBody;

    }
}
export default Cannon;
