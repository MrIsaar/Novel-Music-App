import Matter from "matter-js";
import * as PIXI from "pixi.js";

const COLOR = 0x0000ff; // Blue

const CROSSBAR_ALPHA = 0.3;
const THRESHOLD_ALPHA = 0.05;
const CROSSBAR_WIDTH = 5;

export class Selection extends PIXI.Graphics {
    trajectory = null

    /**
     * 
     * @param {any} selected object such as cannon or instrument with selected.body, selected.position, selected.angle
     */
    constructor(selected, size = 100, selectionUpdate = (selection) => { }) {
        super();
        this.selectionUpdate = selectionUpdate;
        this.selected = selected
        this.position = this.selected.position;
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
            this.updateBodyPosition(x, y);
        }
        else if (this.mode === "rotate") {
            let angle = this.getRelativeAngleFromPoint(x, y);
            this.updateBodyAngle(angle);
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
        if (!x || !y) return;

        let dx = x - this.selected.body.position.x;
        let dy = y - this.selected.body.position.y;
        let dp = { x: dx, y: dy }

        Matter.Body.translate(this.selected.body, dp)
        this.selected.position = this.selected.body.position;

        this.position = this.selected.position;
        this.selectionUpdate(this);
    }
    /***
    * updates angle and scales cannon relative to center of body
    */
    updateBodyAngle(angle) {
        if (!angle) return;

        Matter.Body.setAngle(this.selected.body, angle)
        this.selected.rotation = this.selected.body.angle;
        this.selectionUpdate(this);

    }

    /**
     * Update the value of the given param. value must not be falsy.
     * @param {any} param
     * @param {any} value
     */
    updateSelectedParam(param, value) {
        if (!value) return;

        this.selected[param] = value;
        this.selectionUpdate(this);
    }

    /**
     * Calculates the angle of the given point relative to the selected object.
     * @param {any} x
     * @param {any} y
     */
    getRelativeAngleFromPoint(x, y) {
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

        //console.log(`angle:${this.selected.body.angle}, dx:${dx}, dy:${dy}, calc:${Math.atan(dy / dx)}`);

        return angle;
    }

    /**
     * Draw this object on the stage
     */
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

        if (this.selected.MTObjType === 'Cannon') {

            // Matter.body.update(body,delta,timescale,correction)
            let scale = { x: 2.9, y: 2.83, g: 1.15 };
            let angleDelta = 0.02;
            let trajectoryPoints = { top: this.selected.getTrajectory({ x: scale.x, y: scale.y, g: scale.g, angle: 1 + angleDelta }, 35), bottom: this.selected.getTrajectory({ x: scale.x, y: scale.y, g: scale.g, angle: 1 - angleDelta }, 35) };
            let wasNull = false;
            if (this.trajectory === null) {
                this.trajectory = [new PIXI.Graphics(), new PIXI.Graphics()];
                wasNull = true;
            }
            else {
                this.trajectory[0].clear();
                this.trajectory[1].clear();
            }
            for (let j = 0; j < 2; j++) {
                this.trajectory[j].lineStyle(2, 0xadf8e6, 1);

                this.trajectory[j].moveTo(0, 0);
                if (wasNull)
                    this.addChild(this.trajectory[j]);
            }
            for (let i = 0; i < trajectoryPoints.top.length; i++) {
                this.trajectory[0].lineTo(trajectoryPoints.top[i].x, trajectoryPoints.top[i].y);
                this.trajectory[1].lineTo(trajectoryPoints.bottom[i].x, trajectoryPoints.bottom[i].y);
            }
        }
    }

}
export default Selection;