import React from "react";
import ReactDOM from "react-dom";
import Matter from "matter-js";
import Cannon from "./Cannon"

var cannons = [];
var balls = [];

export class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        var Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        var engine = Engine.create({
            // positionIterations: 20
        });

        var render = Render.create({
            element: this.refs.scene,
            engine: engine,
            options: {
                width: 600,
                height: 600,
                wireframes: false
            }
        });

        var ballA = Bodies.circle(210, 100, 30, { restitution: 0.5 });
        var ballB = Bodies.circle(110, 50, 30, { restitution: 0.5 });
        World.add(engine.world, [
            // walls
            Bodies.rectangle(200, 0, 600, 50, { isStatic: true }),
            Bodies.rectangle(200, 600, 600, 50, { isStatic: true }),
            Bodies.rectangle(260, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);

        World.add(engine.world, [ballA, ballB]);

        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        World.add(engine.world, mouseConstraint);

        Matter.Events.on(mouseConstraint, "mousedown",
            function (event) {
                let position = { x: event.mouse.position.x, y: event.mouse.position.y }
                if (event.mouse.sourceEvents.mousedown.shiftKey) {
                    //var ball = Matter.Bodies.circle(position.x, position.y, 20);
                   /* World.add(engine.world, [ball]);*/
                    for (let i = 0; i < cannons.length; i++) {
                        let ball = cannons[i].fireMarble(-1);
                        balls.push(ball);
                        World.add(engine.world, [ball]);
                    }
                }
                else if (event.mouse.sourceEvents.mousedown.altKey)
                {
                    //let shape = [{ x: 5, y: 100 }, { x: -5, y: 100 }, { x: -5, y: 5 }, { x: -100, y: 5 }, { x: -100, y: -5 }, { x: -5, y: -5 }, { x: -5, y: -100 }, { x: 5, y: -100 }, { x: 5, y: 100 }]
                    //let body = Matter.Bodies.fromVertices(position.x, position.y, shape, { render: { fillStyle: 'red' }, isStatic: true, collisionFilter: { group: 1 } });
                    let body1 = Matter.Bodies.rectangle(position.x, position.y, 60, 5, { render: { fillStyle: 'blue',opacity: 0.5 }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
                    let body2 = Matter.Bodies.rectangle(position.x, position.y, 5, 60, { render: { fillStyle: 'blue', opacity: 0.5 }, isStatic: true, collisionFilter: { group: 0, category: 0, mask: 0 } });
                    World.add(engine.world, [body1,body2]);
                }
                else {
                    let position = { x: event.mouse.position.x, y: event.mouse.position.y }

                    let cannon = new Cannon(position)//<Cannon pos={position} body={null} />;
                    cannons.push(cannon);
                    World.add(engine.world, cannon.getBody());
                    //World.add(engine.world, Bodies.circle(event.mouse.position.x, event.mouse.position.y, 30, { restitution: 0.7 }));
                }
            }
        );

        Engine.run(engine);

        Render.run(render);
    }


    render() {
        return (<div><div ref="scene" /><p>click to create cannon. Shift click to fire marbles.<br/>Other features to be updated</p></div>);
    }
}
export default Scene;