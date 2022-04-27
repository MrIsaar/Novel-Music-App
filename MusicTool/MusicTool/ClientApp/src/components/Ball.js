import React from "react";
import ReactDOM from "react-dom";
import * as PIXI from "pixi.js";
import { Circle } from "./ShapePrimitives";
import Matter from "matter-js";
import MTObj from "./MTObj";

function getShape(radius) {
    let shape = [];
    for (let i = 0; i < 20; i++) {
        let angle = (3.1415 * i) / 10;
        shape.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });

    }
    return shape;
}

 export class Ball extends MTObj  {


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

     constructor(pos, marbleSize, marbleCollisionFilter, fireLayer, marbleColor , image = null) {

        let shape = [{ x: -10, y: 10 }, { x: 10, y: 0 }, { x: -10, y: -10 }, { x: -10, y: 0 }]
         super({x: pos.x,y: pos.y}, 0, shape, image)
        this.marbleSize = marbleSize;
        this.marbleColor = marbleColor;
        this.marbleCollisionFilter = marbleCollisionFilter;
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
                    fillStyle: marbleColor
                },
                collisionFilter: this.marbleCollisionFilter
            });
         this.body = ball;
         this.shape = getShape(marbleSize);
       
        this.fireOn = fireLayer
        

        
        this.marbleSize = marbleSize;
        this.marbleColor = marbleColor;
        this.MTObjType = 'Ball';
        
        
      
     }

     /**
 * 
 *  Draw shape
 */
     draw() {
         this.clear();
         this.pos.x = this.body.position.x;
         this.pos.y = this.body.position.y;
         this.x = this.pos.x;
         this.y = this.pos.y;
         this.beginFill(PIXI.utils.string2hex(this.body.render.fillStyle));
         this.drawPolygon(this.shape);
         this.endFill();
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
    *   inherited method that should not be used
    *  
    */
    saveObject() {
        return {};
    }


    /**
     *  inherited method that should not be used
     * @param {any} savedJSON
     */
    loadObject(savedJSON) {

        
        return {};

    }
}
export default Ball;
