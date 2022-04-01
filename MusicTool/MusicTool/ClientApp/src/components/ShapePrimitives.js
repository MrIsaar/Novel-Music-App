import * as PIXI from "pixi.js";
import { Bodies } from "matter-js";

export class Rect extends PIXI.Graphics {
    constructor(x, y, width, height, options) {
        super();
        this.rectWidth = width;
        this.rectHeight = height;

        this.body = Bodies.rectangle(x, y, width, height, options);
    }

    draw() {
        this.clear();
        this.x = this.body.position.x;
        this.y = this.body.position.y;
        this.pivot.x = this.rectWidth / 2;
        this.pivot.y = this.rectHeight / 2;
        this.rotation = this.body.angle;
        this.lineStyle(this.body.render.lineWidth, 0x505050);
        this.beginFill(PIXI.utils.string2hex(this.body.render.fillStyle), this.body.render.opacity);
        this.drawRect(0, 0, this.rectWidth, this.rectHeight);
        this.endFill();
    }
}

export class Circle extends PIXI.Graphics {
    constructor(x, y, r, options) {
        super();
        this.body = Bodies.circle(x, y, r, options);
    }

    draw() {
        this.clear();
        this.beginFill(PIXI.utils.string2hex(this.body.render.fillStyle), this.body.render.opacity);
        this.drawCircle(this.body.position.x, this.body.position.y, this.body.circleRadius);
        this.endFill();
    }
}