import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";

export class Cannon {

    /**
     * creates a cannon at specified position with angle.
     * 
     * @param {any} pos    {x, y}
     * @param {any} angle angle in radians
     * @param {any} power defaul 20
     * @param {any} fireOn default -1, if -1 then always fires
     * @param {any} marbleColor HTML recognized color, random is default
     * @param {any} marbleSize default 20
     */
    constructor(pos, angle = 0, power = 20, fireOn = -1, marbleColor = "rand", marbleSize = 20) {
        this.shape = [{ x: -20, y: 20 }, { x: 40, y: 0 }, { x: -20, y: -20 }, { x: -30, y: 0 }]
        this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle,render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.fireOn = fireOn;
        this.pos = pos;
        this.angle = angle;
        this.power = power;
        this.marbleSize = marbleSize;
        this.marbleColor = marbleColor;

    }
    getBody() {
        return this.body;
    }

    /**
     *     firelayer must match fireOn value or if fireOn is -1 will fire
     * 
     * return ball with current pos, angle, and power of shot 
     * 
     */
    fireMarble(fireLayer) {
        if (fireLayer != -1 && this.fireOn != -1 && fireLayer != this.fireOn) {
            return;   // do not fire
        }
        // choose color of marble

        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        let color = "#" + randomColor;
        let rand = Math.random();
        if (rand > 0.6) { color = 'orange' }
        if (this.marbleColor != "rand") {
            color = this.marbleColor;
        }

        //var ball = Matter.Bodies.circle(this.pos.x, this.pos.y,20);
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
        let dv = { x: this.power * Math.cos(this.angle), y: this.power * Math.sin(this.angle) };
        Matter.Body.setVelocity(ball, dv)
        return ball;

    }
}
export default Cannon;
