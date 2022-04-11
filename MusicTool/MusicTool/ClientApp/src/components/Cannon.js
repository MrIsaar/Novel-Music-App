﻿
import Matter from "matter-js";
import MTObj from "./MTObj";

export class Cannon extends MTObj {

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
    constructor(pos, angle = 0, power = 20, fireLayer = -1, marbleColor = "rand", marbleSize = 20, marbleCollisionFilter = { group: 0, category: -1, mask: -1 }, image = null) {
        let shape = [{ x: -20, y: 20 }, { x: 40, y: 0 }, { x: -20, y: -20 }, { x: -30, y: 0 }]
        super(pos, angle, shape, image);
        //this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle,render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.fireOn = fireLayer;
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
            this.pos.x,
            this.pos.y,
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
            MTObjType: 'Cannon',
            pos: this.pos,
            angle: this.angle,
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
        let previousBody = this.body;
        this.shape = savedJSON.shape;
        this.collisionFilter = savedJSON.collisionFilter;
        this.body = Matter.Bodies.fromVertices(savedJSON.pos.x, savedJSON.pos.y, this.shape, { angle: savedJSON.angle, render: { fillStyle: 'red' }, isStatic: true, collisionFilter: savedJSON.collisionFilter });
        this.pos = savedJSON.pos;
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
