﻿import * as PIXI from "pixi.js";
import { Circle } from "./ShapePrimitives";
import Matter from "matter-js";

 export class Cannon extends PIXI.Graphics{

    /**
     * creates a cannon at specified position with angle.
     * 
     * @param {any} pos    {x, y}
     * @param {any} angle angle in radians
     * @param {any} power default 20 how fast marbles will be shot
     * @param {any} fireOn default -1, if -1 then always fires
     * @param {any} marbleColor HTML recognized color, random is default
     * @param {any} marbleSize default 20
     */
     constructor(pos, angle = 0, power = 20, fireOn = -1, marbleColor = "rand", marbleSize = 20) {
        super();
        this.shape = [{ x: -20, y: 20 }, { x: 40, y: 0 }, { x: -20, y: -20 }, { x: -30, y: 0 }]
        this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle,render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.fireOn = fireOn;
        this.pos = pos;
        this.rotation = angle;
        this.power = power;
        this.marbleSize = marbleSize;
        this.marbleColor = marbleColor;

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
    fireMarble(fireLayer=-1) {
        if (fireLayer !== -1 && this.fireOn !== -1 && fireLayer !== this.fireOn) {
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
         var ball = new Circle(
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
         let dv = { x: this.power * Math.cos(this.rotation), y: this.power * Math.sin(this.rotation) };
         Matter.Body.setVelocity(ball.body, dv)
         return ball;

     }

     draw() {
         this.clear();
         this.x = this.pos.x;
         this.y = this.pos.y;
         this.beginFill(PIXI.utils.string2hex(this.body.render.fillStyle));
         this.drawPolygon(this.shape);
         this.endFill();
     }
}
export default Cannon;
