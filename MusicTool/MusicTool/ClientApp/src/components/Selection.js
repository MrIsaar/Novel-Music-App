import Matter from "matter-js";
import * as PIXI from "pixi.js";

const COLOR = 0x0000ff; // Blue
const CROSSBAR_ALPHA = 0.3;
const THRESHOLD_ALPHA = 0.05;
const CROSSBAR_WIDTH = 5;

export class Selection extends PIXI.Graphics {
    /**
     * 
     * @param {any} selected object such as cannon or instrument with selected.body, selected.pos, selected.angle
     */
    constructor(selected, size = 100) {
        super();
        this.selected = selected
        this.position = this.selected.pos;
        this.size = size < 40 ? 40 : size;
        this.translationThreshold = this.size * 0.6;
        this.rotationThreshold = this.size;
        this.mode = 0;
    }

    /**
     *  Given x y coordinates of mouse event determines transaltion or rotation
     *  sets mode to "translate" or "rotate" 
     *  clicking out side of thresholds will return false
     *  otherwise true
     * @param {any} x
     * @param {any} y
     */
    handleSelection(x, y) {
        let point = { x: x, y: y };

        let distance = Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
        if (this.mode === 0) {
            //if (Matter.Bounds.contains(this.translationThreshold.bounds, point)) {
            if (distance <= this.translationThreshold) {
                this.mode = "translate";
            }
            //else if (Matter.Bounds.contains(this.rotationThreshold.bounds, point)) {
            else if (distance <= this.rotationThreshold) {
                this.mode = "rotate";
            }
        }
        if (this.mode === "translate") {
            this.updateBodyPosition(x, y)
        }
        else if (this.mode === "rotate") {
            this.updateBodyAngle(x, y)
        }
        else {
            return false;
        }
        return true;
    }

    /**
     *  resets selction mode to none 
     */
    cleanMode() {
        this.mode = 0;
    }

    /**
     * updates selected objects position to provided x,y
     * @param {any} x position
     * @param {any} y position
     */
    updateBodyPosition(x, y) {
        let dx = x - this.selected.body.position.x;
        let dy = y - this.selected.body.position.y;
        let dp = { x: dx, y: dy }

        Matter.Body.translate(this.selected.body, dp)
        this.selected.pos = this.selected.body.position;

        this.position = this.selected.pos;
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
        this.selected.rotation = this.selected.body.angle;
        console.log(`angle:${this.selected.body.angle}, dx:${dx}, dy:${dy}, calc:${Math.atan(dy / dx)}`);
    }

    draw() {
        this.clear();

        this.beginFill(COLOR, CROSSBAR_ALPHA);
        this.drawRect(-this.size / 2, -CROSSBAR_WIDTH / 2, this.size, CROSSBAR_WIDTH);
        this.drawRect(-CROSSBAR_WIDTH / 2, -this.size / 2, CROSSBAR_WIDTH, this.size);
        this.endFill();

        this.beginFill(COLOR, THRESHOLD_ALPHA);
        this.drawCircle(0, 0, this.translationThreshold);
        this.drawCircle(0, 0, this.rotationThreshold);
        this.endFill();
    }

}
export default Selection;