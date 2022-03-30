﻿import Matter from "matter-js";



export class Selection {
    /**
     * 
     * @param {any} selected object such as cannon or instrument with selected.body, selected.pos, selected.angle
     */
    constructor(selected, size = 100) {
        this.selected = selected
        this.size = size;
        if (size < 40) { size = 40 }
        this.horizontal = Matter.Bodies.rectangle(selected.pos.x, selected.pos.y, size, 5, { render: { fillStyle: 'blue', opacity: 0.3 }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.vertical = Matter.Bodies.rectangle(selected.pos.x, selected.pos.y, 5, size, { render: { fillStyle: 'blue', opacity: 0.3 }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.translationThreshold = Matter.Bodies.circle(selected.pos.x, selected.pos.y, size - (0.4 * size), { render: { fillStyle: 'blue', opacity: 0.05 }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.rotationThreshold = Matter.Bodies.circle(selected.pos.x, selected.pos.y, size, { render: { fillStyle: 'blue', opacity: 0.05 }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.bodies = [this.horizontal, this.vertical, this.translationThreshold, this.rotationThreshold];
        this.mode = 0;
    }

    /**
     *  Given x y coordinates of mouse event determines transaltion or rotation
     *  clicking out side of thresholds will return false
     *  otherwise true
     * @param {any} x
     * @param {any} y
     */
    handleSelection(x, y) {
        let point = { x: x, y: y };

        let distance = Math.sqrt(Math.pow(this.translationThreshold.position.x - point.x, 2) + Math.pow(this.translationThreshold.position.y - point.y, 2));
        if (this.mode == 0) {
            //if (Matter.Bounds.contains(this.translationThreshold.bounds, point)) {
            if (distance <= this.translationThreshold.circleRadius) {
                this.mode = "translate";
            }
            //else if (Matter.Bounds.contains(this.rotationThreshold.bounds, point)) {
            else if (distance <= this.rotationThreshold.circleRadius) {
                this.mode = "rotate";
            }
        }
        if (this.mode == "translate") {
            this.updateBodyPosition(x, y)
        }
        else if (this.mode == "rotate") {
            this.updateBodyAngle(x, y)
        }
        else {
            return false;
        }
        return true;
    }

    cleanMode() {
        this.mode = 0;
    }

    updateBodyPosition(x, y) {
        let dx = x - this.selected.body.position.x;
        let dy = y - this.selected.body.position.y;
        let dp = { x: dx, y: dy }
        Matter.Body.translate(this.selected.body, dp)
        Matter.Body.translate(this.horizontal, dp)
        Matter.Body.translate(this.vertical, dp)
        Matter.Body.translate(this.translationThreshold, dp)
        Matter.Body.translate(this.rotationThreshold, dp)

        this.selected.pos = this.selected.body.position;

    }
    /***
    * updates angle and scales cannon relative to center of body
    */
    updateBodyAngle(x, y) {
        let dx = x - this.selected.body.position.x;
        let dy = y - this.selected.body.position.y;
        let angle = 0;
        if (dx === 0 && dy === 0)
            angle = 0;
        else if (dx === 0) {
            angle = (3.14 * dy) / (2 * Math.abs(dy));
        }
        else
            angle = Math.atan(dy / dx)
        if (dx < 0) {
            angle = 3.1415 + angle
        }

        Matter.Body.setAngle(this.selected.body, angle)
        this.selected.angle = this.selected.body.angle;
        console.log(`angle:${this.selected.body.angle}, dx:${dx}, dy:${dy}, calc:${Math.atan(dy / dx)}`);
    }

}
export default Selection;