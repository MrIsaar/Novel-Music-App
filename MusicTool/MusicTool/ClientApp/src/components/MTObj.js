import * as PIXI from "pixi.js";
import Matter from "matter-js";

export class MTObj extends PIXI.Graphics{
    /**
     * creates a cannon at specified position with angle.
     * 
     * @param {any} pos    {x, y}
     * @param {any} shape shape of the object, defaulted to a square
     * @param {any} angle angle in radians
     */
    constructor(objectNumber,pos, angle = 0, shape = [{ x: 20, y: 20 }, { x: 20, y: -20 }, { x: -20, y: -20 }, { x: -20, y: 20 }], color='red', collisionFilter = { group: 0, category: 0, mask: 0 }, image = null, restitution = 0) {
        super()
        this.objectNumber = objectNumber;
        this.shape = shape;
        this.color = color;
        this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle, render: { fillStyle: this.color }, isStatic: true, collisionFilter: collisionFilter });
        this.position = pos;
        this.angle = angle;
        this.image = image;
        this.MTObjType = 'MTObj';
        this.MTObjVersion = '1.0.0';
        this.collisionFilter = collisionFilter;
    }

    /**
     * 
     *  Draw shape
     */
    draw() {
        if (this._geometry == null) {
            return;
        }
        this.clear();
        this.x = this.position.x;
        this.y = this.position.y;
        this.angle = this.body.angle * (180 / 3.141592);
        this.beginFill(PIXI.utils.string2hex(this.body.render.fillStyle));
        this.drawPolygon(this.shape);
        this.endFill();
    }

    /**
     *  Returns matter.js body of this cannon 
     */
    getBody() {
        return this.body;
    }

    /**
     * Returns image  
     */
    getImage() {
        return this.image;
    }


    /**
     *  set angle in radians
     * @param {any} newAngle in radians
     */
    updateAngle(newAngle) {
        this.angle = newAngle;
        Matter.Body.setAngle(this.body, newAngle)
    }

    /**
     * set posttion to {x: xposition, y: yposition}
     * @param {any} newPos  {x: xposition, y: yposition}
     */
    updatePosition(newPos) {
        this.pos = newPos;
        Matter.Body.setPosition(this.body, newPos);
    }

    /**
     *  change Collision Filter to specify which objects can colide
     * @param {any} collisionFilter
     */
    changeCollisionFilter(collisionFilter) {
        this.body.collisionFilter = collisionFilter;
        this.collisionFilter = collisionFilter
    }

    /**
     *  returns a simplified version  JSON object of this object that can be saved
     *  loaded with the loadObject function
     */
    saveObject() {
        return {
            MTObjType: 'MTObj',
            MTObjVersion: this.MTObjVersion,
            objectNumber: this.objectNumber,
            position: { x: this.position.x, y: this.position.y }, // changes from pixi position to basic json object
            angle: (this.angle % 360.0) * (3.141592 / 180),
            image: this.image,
            shape: this.shape,
            color: this.color,
            collisionFilter: this.collisionFilter
        }
    }

    /**
     *  instatiate object based on saved version of this object from saveObject
     * @param {any} savedJSON
     */
    loadObject(savedJSON) {

        this.MTObjType = 'MTObj';
        var previousBody = this.body;
        this.shape = savedJSON.shape;
        this.color = savedJSON.color;
        this.collisionFilter = savedJSON.collisionFilter;
        this.body = Matter.Bodies.fromVertices(savedJSON.position.x, savedJSON.position.y, this.shape, { angle: savedJSON.angle, render: { fillStyle: this.color }, isStatic: true, collisionFilter: savedJSON.collisionFilter });
        this.position = savedJSON.position;
        this.angle = savedJSON.angle;
        this.image = savedJSON.image;
        return previousBody;
    }
}
export default MTObj;
