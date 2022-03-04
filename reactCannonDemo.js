import React, { useEffect, useRef } from 'react'
import Matter, { Engine,Runner, Render, Bodies, World } from 'matter-js'


function createCannon (x,y,ax,ay,size = 40)
{
  let angle =0;
  if(ax === 0 && ay === 0)
    angle = 0;
  else if (ax === 0){
    angle = (3.14*ay)/(2*Math.abs(ay));
  }
  else
    angle = Math.atan(ay/ax)

    if(ax < 0)
    {
      angle = 3.1415 + angle
    }
  // [{x: -20,y: 20},{x: 40,y: 0},{x: -20,y: -20}]
  //let body = Bodies.rectangle(x, y, size, size*(15/40), {angle:angle, isStatic: true,collisionFilter: {group: -1} })
  //let body = Bodies.trapezoid(x, y, size, size*(15/40),3.14/10, {angle:angle, isStatic: true,collisionFilter: {group: -1} })
  //let shape = [{x: -20,y: -20},{x: -20,y: 20},{x: -10,y: 20},{x: -10,y: 40},{x: 10,y: 40},{x: 10,y: 20},{x: 15,y: 20},{x: 15,y: 15},{x: 20,y: 15},{x: 20,y: -20},{x: 15,y: -20},{x: 15,y: -25},{x: -15,y: -25},{x: -15,y: -20},{x: -20,y: -20},{x: -20,y: 20}]
  
  let shape = [{x: -20,y: 20},{x: 40,y: 0},{x: -20,y: -20}]
  let body = Bodies.fromVertices(x,y,shape, {angle:angle, isStatic: true,collisionFilter: {group: -1} });
  return body
}

/***
 * updates angle and scales cannon relative to center of body
 */
function updateCannon (body, dx, dy)
{
  let angle =0;
  if(dx === 0 && dy === 0)
    angle = 0;
  else if (dx === 0){
    angle = (3.14*dy)/(2*Math.abs(dy));
  }
  else
    angle = Math.atan(dy/dx)
  if(dx < 0)
  {
    angle = 3.1415 + angle
  }
  Matter.Body.setAngle(body, angle)
  console.log(`angle:${body.angle}, dx:${dx}, dy:${dy}, calc:${Math.atan(dy/dx)}`);
  let distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
  if (distance < 40){distance = 40; }
  let xsize = distance
  let ysize = distance
  Matter.Body.scale(body,distance/xsize,distance/ysize)


}




function Comp (props) {
  const scene = useRef()
  const isPressed = useRef(false)
  const currentCannon = useRef();
  
  const engine = useRef(Engine.create())
  //const runner = Runner.create();
  Runner.run(engine.current);
  
  
  
  Matter.Events.on(engine.current, 'beforeUpdate', fireBalls);

  var cannons = [];

  var balls = []
  var ballMax = 70
  var ballCurr = 0
  var timeStampLimit = 0
  var framesLeft = 0
  var frameOffset = 8
  useEffect(() => {
    const cw = document.body.clientWidth
    const ch = document.body.clientHeight + 500

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'lightblue'
      }
    })

    

    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle((3 * cw) / 4, ch / 2, 70, 170, { isStatic: true, angle: (7*3.14)/8 }),
      Bodies.rectangle(cw / 4, ch / 2, 70, 170, { isStatic: true, angle: 3.14/8 })
    ])
    for(let i = 0;i < ballMax/4;i++)
    {
      let radius = 5
      let xvel = 70 - i * 0.75
      let ball = Bodies.circle(2*radius,ch - 2*radius - 4*radius*i,radius,{restitution: 1, wireframes:false, render:{fillStyle:'red'},collisionFilter: {group: 2}})
      World.add(engine.current.world,[ball])
      Matter.Body.setVelocity(ball,{x:xvel - 5 + Math.random() * 10 , y:-10})
      balls.push(ball)
      ball = Bodies.circle(cw - 2*radius,ch - 2*radius - 4*radius*i,radius,{restitution: 1, wireframes:false, render:{fillStyle:'red'},collisionFilter: {group: 2}})
      World.add(engine.current.world,[ball])
      Matter.Body.setVelocity(ball,{x:-xvel - 5 + Math.random() * 10, y:-10})
      balls.push(ball)

      World.add(engine.current.world,createCannon(     3*radius,ch - 2*radius - 4*radius*i,xvel,-10))
      World.add(engine.current.world,createCannon(cw - 3*radius,ch - 2*radius - 4*radius*i,-xvel,-10))

    }

    


    //Matter.Runner.run(engine);
    //Engine.run(engine.current)
    Render.run(render)

    // create runner
    

// run the engine
    

    return () => {
      Render.stop(render)
      World.clear(engine.current.world)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [])

  function fireBalls (event)
  {
    if (event.timestamp / 1000 > timeStampLimit )
    {
        timeStampLimit++
        for(let i = 0; i < cannons.length; i++)
        {
          let cannon = cannons[i]
          createBall(cannon.position.x,cannon.position.y,cannon.angle,20);
        }
    }
    
  }
  
function createBall(x,y,angle,power)
{
      if (ballMax <= ballCurr)
      {
        console.log(ballCurr)
        console.log(balls.length)
        
        let curr = balls[ballCurr%ballMax]
        Matter.Composite.remove(engine.current.world, curr)
        
      }
      
      var randomColor = Math.floor(Math.random()*16777215).toString(16);
      let color = "#" + randomColor
      let rand =Math.random();
      if(rand > 0.7)
        color = 'orange'
      if (rand < 0.7 && rand > 0.5)
        color = '#ffcc00'
      const ball = Bodies.circle(
        x,
        y,
        10 + Math.random() * 30,
        {
          mass: 10,
          restitution: 1,
          friction: 0.005,
          render: {
            fillStyle: color
          },
          collisionFilter: {group: -1}
        })
        let dv = {x: power * Math.cos(angle),y: power * Math.sin(angle)}

         
        // if(e.movementX < 0)
        //   dv = {x: -20,y: -10}
        // else if (e.movementX > 0)
        //   dv = {x: 20,y: -10}
      Matter.Body.setVelocity(ball,dv)
      balls[ballCurr%ballMax] = ball
      ballCurr++
      World.add(engine.current.world, [ball])

}

  const handleKeyDown = e => {
    console.log(`Key: ${e.key} with keycode ${e.keyCode} has been pressed`);


  }


  const handleDown = e => {
    isPressed.current = true
    currentCannon.current = createCannon(e.clientX,e.clientY,0,0,70);
    World.add(engine.current.world, [currentCannon.current])
  }

  const handleUp = () => {
    isPressed.current = false
    cannons.push(currentCannon.current)
    currentCannon.current = {}
  }

  const handleAddCircle = e => {
    
    if (isPressed.current ) {
      
      let dx = e.clientX -currentCannon.current.position.x ;
      let dy = e.clientY - currentCannon.current.position.y;
      updateCannon(currentCannon.current, dx,dy);
      
      //




      // framesLeft = frameOffset
      // if (ballMax <= ballCurr)
      // {
      //   console.log(ballCurr)
      //   console.log(balls.length)
        
      //   let curr = balls[ballCurr%ballMax]
      //   Matter.Composite.remove(engine.current.world, curr)
        
      // }
      
      // var randomColor = Math.floor(Math.random()*16777215).toString(16);
      // let color = "#" + randomColor
      // let rand =Math.random();
      // if(rand > 0.7)
      //   color = 'orange'
      // if (rand < 0.7 && rand > 0.5)
      //   color = '#ffcc00'
      // const ball = Bodies.circle(
      //   e.clientX,
      //   e.clientY,
      //   10 + Math.random() * 30,
      //   {
      //     mass: 10,
      //     restitution: 0.9,
      //     friction: 0.005,
      //     render: {
      //       fillStyle: color
      //     }
      //   })
      //   let dv = {x: 0,y: -10}
      //   if(e.movementX < 0)
      //     dv = {x: -20,y: -10}
      //   else if (e.movementX > 0)
      //     dv = {x: 20,y: -10}
      // Matter.Body.setVelocity(ball,dv)
      // balls[ballCurr%ballMax] = ball
      // ballCurr++
      // World.add(engine.current.world, [ball])
    }
    else if (isPressed.current)
    {
      //framesLeft--
    }
  }

  return (
    <div
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleAddCircle}
      onKeyDown={handleKeyDown}
    >
      <div ref={scene} style={{ width: '100%', height: '100%' }} />
      <div><p>I reacted</p></div>
      
    </div>
  )
}

export default Comp
