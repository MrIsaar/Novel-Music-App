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
   constructor(pos, angle = 0, power = 20, fireOn = -1, marbleColor = "rand", marbleSize = 20, marbleCollisionFilter = { group: -1, category: 0xFFFFFFFF, mask: 0xFFFFFFFF }) {
        super();
        this.body = Matter.Bodies.fromVertices(pos.x, pos.y, CANNON_SHAPE, { angle: angle,render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.fireOn = fireOn;
        this.position = pos;
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
        let dv = { x: this.power * Math.cos(this.rotation), y: this.power * Math.sin(this.rotation) };
        console.log(`dv: ${dv.x} pox: ${ball.body.position.x}`)
         Matter.Body.setVelocity(ball.body, dv)
         return ball;


     }

     /**
     * Draw this object on the stage
     */
     draw() {
         this.clear();
         this.beginFill(CANNON_COLOR);
         this.drawPolygon(CANNON_SHAPE);
         this.endFill();
     }
}
export default Cannon;
