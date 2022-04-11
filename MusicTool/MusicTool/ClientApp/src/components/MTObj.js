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
    constructor(pos, angle = 0, shape = [{ x: 20, y: 20 }, { x: 20, y: -20 }, { x: -20, y: -20 }, { x: -20, y: 20 }], image = null) {
        super()
        this.shape = shape;
        this.body = Matter.Bodies.fromVertices(pos.x, pos.y, this.shape, { angle: angle, render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
        this.pos = pos;
        this.angle = angle;
        this.image = image;
        this.MTObjType = 'MTObj';
        this.MTObjVersion = '1.0.0';
        this.collisionFilter = { group: 0, category: 0, mask: 0 }
    }

    /**
     * 
     *  Draw shape
     */
    draw() {
        this.clear();
        this.x = this.pos.x;
        this.y = this.pos.y;
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
     *  
     */
    saveObject() {
        return {
            MTObjType: 'MTObj',
            MTObjVersion: this.MTObjVersion,
            pos: this.pos,
            angle: this.angle,
            image: this.image,
            shape: this.shape,
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
        this.collisionFilter = savedJSON.collisionFilter;
        this.body = Matter.Bodies.fromVertices(savedJSON.pos.x, savedJSON.pos.y, this.shape, { angle: savedJSON.angle, render: { fillStyle: 'red' }, isStatic: true, collisionFilter: savedJSON.collisionFilter });
        this.pos = savedJSON.pos;
        this.angle = savedJSON.angle;
        this.image = savedJSON.image;
        
        return previousBody;

    }
}
export default MTObj;
