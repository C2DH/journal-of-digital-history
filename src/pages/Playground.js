import React, { useState, useEffect, useRef } from 'react'
import { Container, Col, Row, Form } from 'react-bootstrap'

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}


function drawCircle(ctx, {
  cx = 0,
  cy = 0,
  radius = 10,
  fillStyle = 'transparent',
  strokeStyle = 'black',
  lineWidth = .5
} = {}){
  ctx.fillStyle = fillStyle
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke(); // Draw it
}

const drawBackground = (ctx, { fillStyle = '#dddddd'} = {}) => {
  console.info('draw', ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = fillStyle
  ctx.beginPath()
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
//
// const draw = (ctx, frameCount) => {
//   console.info('draw', ctx.canvas.width, ctx.canvas.height)
//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
//   ctx.fillStyle = '#cccccc'
//   ctx.beginPath()
//   ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
//   ctx.fill()
//
//   let step = 10;
//   let lines = [];
//   let size = 500
//   // Create the lines
//   for(var i = step; i <= size - step; i += step) {
//     var line = [];
//     for(var j = step; j <= size - step; j+= step) {
//       var distanceToCenter = Math.abs(j - size / 2);
//       var variance = Math.max(size / 2 - 50 - distanceToCenter, 0);
//       var random = Math.random() * variance / 2 * -1;
//       var point = {x: j, y: i + random};
//       line.push(point);
//     }
//     lines.push(line);
//   }
//
//   // Do the drawing
//   for(var i = 5; i < lines.length; i++) {
//   ctx.beginPath();
//   ctx.moveTo(lines[i][0].x, lines[i][0].y);
//
//   for(var j = 0; j < lines[i].length - 2; j++) {
//     var xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
//     var yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
//     ctx.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
//   }
//
//   ctx.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
//   ctx.save();
//   ctx.globalCompositeOperation = 'destination-out';
//   ctx.fill();
//   ctx.restore();
//   ctx.stroke();
// }
// }


const Canvas = ({ visualVariables, ...props }) => {
  const canvasRef = useRef(null)
  const [canvasProps, setCanvasProps] = useState({
    height: 100,
    width: 100,
    ratio: 2,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { devicePixelRatio:ratio=1 } = window
    const { width } = canvas.getBoundingClientRect()
    console.info('resizeCanvas', canvas.getBoundingClientRect(), ratio)
    canvas.width = width*ratio
    canvas.height = width*ratio
    setCanvasProps({
      height: width,
      width,
      ratio,
      ctx,
    })
    ctx.scale(ratio, ratio)
  }, [])

  useEffect(() => {
    const { ctx, height, width } = canvasProps
    console.info(visualVariables)
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, width, height);
    drawBackground(ctx)
    ctx.globalCompositeOperation = visualVariables.compositeOperation;
    drawCircle(ctx, {
      cx: width/2 + visualVariables.distance,
      cy: height/2,
      fillStyle: 'cyan',
      strokeStyle: 'red',
      radius: visualVariables.radius,
    })
    drawCircle(ctx, {
      cx: width/2,
      cy: height/2 + visualVariables.distance,
      fillStyle: 'yellow',
      strokeStyle: 'cyan',
      radius: visualVariables.radius,
    })
    drawCircle(ctx, {
      cx: width/2 - visualVariables.distance,
      cy: height/2,
      fillStyle: 'magenta',
      strokeStyle: 'blue',
      radius: visualVariables.radius,
    })
  }, [visualVariables, canvasProps])
  return <canvas ref={canvasRef} {...props}/>
}


const Playground = () => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 100)
    window.addEventListener('resize', debouncedHandleResize)
    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  const [visualVariables, setVisualVariables] = useState({
    radius: 50,
    distance: 5,
    compositeOperation: 'xor'
  })

  const changeVisualVariable = (key, value) => {
    setVisualVariables({
      ...visualVariables,
      [key]: value,
    })
  }

  return <div style={{backgroundColor: 'var(--gray-300)', height: dimensions.height }}>
    <Container className="py-5">
      <Row>
        <Col>
          <div style={{
            width: '100%',
            height: 0,
            paddingTop: '100%',
            // background: 'var(--primary)'
          }}>
            <div class="position-absolute w-100 h-100" style={{top: 0 }}>
              <Canvas visualVariables={visualVariables}/>
            </div>
          </div>
        </Col>
        <Col>commands
        <Form>
          <Form.Group controlId="formBasicRange">
            <Form.Label>radius {visualVariables.radius}</Form.Label>
            <Form.Control defaultValue={visualVariables.radius} type="range" onChange={(e) => changeVisualVariable('radius', parseInt(e.target.value, 10))} />
          </Form.Group>
          <Form.Group controlId="formBasicRange">
            <Form.Label>distance {visualVariables.distance}</Form.Label>
            <Form.Control defaultValue={visualVariables.distance} type="range" min="-100" max="100" onChange={(e) => changeVisualVariable('distance', parseInt(e.target.value, 10))} />
          </Form.Group>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Custom select</Form.Label>
            <Form.Control as="select" defaultValue={visualVariables.compositeOperation} custom onChange={(e) => changeVisualVariable('compositeOperation', e.target.value)}>
              <option>overlay</option>
              <option>multiply</option>
              <option>destination-out</option>
              <option>luminosity</option>
              <option>color</option>
              <option>saturation</option>
              <option>xor</option>
              <option>lighter</option>
              <option>screen</option>
            </Form.Control>
          </Form.Group>
        </Form>
        </Col>
      </Row>
    </Container>
  </div>
}

export default Playground;
