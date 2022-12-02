import Matter from "matter-js";
import MTObj from "./MTObj";
import Ball from "./Ball";
import * as PIXI from "pixi.js";

// Cannon rendering constants
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
     constructor(objectNumber, pos, angle = 0, power = 20, fireLayer = -1, gravity, marbleColor = "rand", marbleSize = 20, marbleCollisionFilter = { group: -1, category: 0xFFFFFFFF, mask: 0xFFFFFFFF }, shape = CANNON_SHAPE, collisionFilter = { group: 0, category: 0, mask: 0 }, image = null) {
         super(objectNumber,pos, angle, shape, collisionFilter, image)
        
        // body created in super MTObj
        //this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle,render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
         this.fireOn = fireLayer;
         this.gravity = gravity;
        
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

     updatePower(power) {
         this.power = power;
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

        var ball = new Ball(this.body.position, this.marbleSize, this.marbleCollisionFilter,this.fireLayer,color);
        ball.body.frictionAir = 0;
        //set velocity
        let dv = { x: this.power * Math.cos(this.rotation), y: this.power * Math.sin(this.rotation) };
        //console.log(`dv: ${dv.x} pox: ${ball.body.position.x}`)
         Matter.Body.setVelocity(ball.body, dv)
         return ball;
     }

     /**
      * provides trajectory for balls fired from this cannon assuming the position of the cannon is (0,0)
      * @param {float} scale scale for how much power effects
      * @param {int} points number of points to output
      */
     getTrajectory(gravity, scale, points) {


         let normalizedAngleVec = { x: Math.cos(this.rotation) * scale.angle, y: Math.sin(this.rotation) * scale.angle };
         /*let denom = Math.abs(normalizedAngleVec.x + normalizedAngleVec.y)
         normalizedAngleVec.x = normalizedAngleVec.x / denom;
         normalizedAngleVec.y = normalizedAngleVec.y / denom;*/
         let velocityInital = { x: this.power * normalizedAngleVec.x * scale.x, y: this.power * normalizedAngleVec.y * scale.y };
         let acceleration = { x: this.gravity.x * scale.g, y: this.gravity.y * scale.g }
         
         
         // pixi will handle intial position
         // y = ax^2 + bx + c
         const out = [];
         
         for (let t = 1; t < points; t++) {
             let point = {x: 0, y: 0};
             point.x = acceleration.x * t * t + velocityInital.x * t;
             point.y = acceleration.y * t * t + velocityInital.y * t;// x = vt
             out.push(point); // y = at^2 + vt
         }
         //  
         return out;
         

         /*const quadratic = new PIXI.Graphics();
         quadratic.lineStyle(5, 0xAA0000, 1);
         let powerScale = this.power * 1.6
         quadratic.quadraticCurveTo(powerScale * dv.x, powerScale * dv.y, powerScale *  2 * dv.x,  0);
         quadratic.position.x = this.position.x;
         quadratic.position.y = this.position.y;
         return quadratic;*/
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
