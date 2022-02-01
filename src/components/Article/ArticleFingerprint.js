import React, { useRef } from 'react'
import { scalePow,  } from 'd3-scale'
import { extent  } from 'd3-array'
import ArticleFingerprintCellGraphics from './ArticleFingerprintCellGraphics'
import { animated, useSpring, config} from 'react-spring'

const ArticleFingerprint = ({
  stats={},
  cells=[],
  // svg dimnsion. Radisu is calculated based on this.
  size=100,
  debug=false,
  // this space is needed for the text elements
  margin=20,
  //
  variant='',
  onMouseMove,
  onClick,
  onMouseOut,
}) => {
  // reference value for the clicked idx
  const cached = useRef({ idx: -1})
  // animated properties for current selected "datum"
  const [pointer, api] = useSpring(() => ({ theta : 0, idx:0, opacity: 0, config: config.stiff }))
  const radius = (size/2 - margin) * 2 / 3
  // value radius, this give us extra safety margin.
  const maxNumCharsRadius = radius / 2
  const maxNumRefsRadius = 5
  const angleD = (Math.PI * 2) / (cells.length + 1)
  // this is the scale function linked to the total numbers of characters in a cell.
  // th scaled value is a number comprised between 0 and baseRadius
  // according to the number of characters
  const scaleNumChars = scalePow()
      // linear, commented out
      // .exponent(1)
      // with powerscale, exponent 0.25
      .exponent(0.25)
      .domain(stats?.extentChars || [0,1])
      .range([0, maxNumCharsRadius])

  const scaleNumRefs = scalePow()
    .exponent(1)
    .domain(stats?.extentRefs || [0,1])
    .range([1.5, maxNumRefsRadius])

  const scaleTheta = scalePow().exponent(1).domain([0, 360]).range([0, cells.length + 1])



  const mouseMoveHander = (e) => {
    if (typeof onMouseMove !== 'function') {
      return
    }
    // get cell based on mouse position
    const x = e.nativeEvent.offsetX - size/2
    const y = e.nativeEvent.offsetY - size/2
    // get angle and relative cell.
    const radians = Math.atan2(y, x) + Math.PI / 2 // correction
    const absRadians = radians < 0 ? radians + Math.PI * 2 : radians
    const theta = absRadians * 180 / Math.PI
    const datumIdx = Math.round(scaleTheta(theta))
    const idx = cells[datumIdx] ? datumIdx : 0
    const datum = cells[idx]
    // save idx
    cached.current.idx = idx
    api.start({ theta: theta - 90, idx, opacity: 1 })
    onMouseMove(e, datum, cells[datumIdx] ? datumIdx : 0 )
  }

  const mouseOutHandler = () => {
    api.start({ opacity: 0 })
    if (typeof onMouseOut === 'function') {
      onMouseOut()
    }
  }

  const onClickHandler = (e) => {
    if (typeof onClick === 'function') {
      if (cached.current.idx !== -1) {
        const datum = cells[cached.current.idx]
        onClick(e, datum, cached.current.idx)
      } else {
        onClick(e)
      }
    }
  }

  if (cells.length===0) {
    return null
  }
  if (debug) {
    console.info(
      'ArticleFingerprint',
      '\n extentChars:', stats?.extentChars,
      '\n recalculated extentChars:', extent(cells, (d) => d.countChars),
      '\n range:', [0, maxNumCharsRadius]
    )
  }
  return (
    <svg className={`ArticleFingerprint position-absolute ${variant}`}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      onMouseMove={mouseMoveHander}
      onClick={onClickHandler}
    >
      <g transform={`translate(${size/2}, ${size/2})`}>
        {debug // outer circle (narrative layer)
          ? <circle cx={0} cy={0} stroke="var(--gray-500)" fill="transparent" r={radius + maxNumCharsRadius}/>
          : null
        }
        {debug // inner circle (hermeneutics layer)
          ? <circle cx={0} cy={0} stroke="var(--primary)" fill="transparent" r={radius - maxNumCharsRadius}/>
          : null
        }
        {debug // baseRadius
          ? <circle cx={0} cy={0} stroke="var(--secondary)" fill="transparent" r={radius}/>
          : null
        }
        {/* baseRadius circle
        <circle cx={0} cy={0} stroke="var(--secondary)" fill="transparent" r={baseRadius}/>
        */}
        {cells.map((cell, i) => {
          const theta = (i) * angleD - Math.PI/2
          const numCharsRadius = scaleNumChars(cell.countChars)
          const numRefsRadius = scaleNumRefs(cell.countRefs)
          return (
            <ArticleFingerprintCellGraphics key={i}
              theta={theta}
              originRadius={radius}
              circleRadius={2.5}
              offsetRadius={
                // if isHermeneutic, inWard, if is heading is 0
                cell.isHermeneutic
                  ? numCharsRadius * -1
                  : numCharsRadius
              }
              refsRadius={cell.countRefs ? numRefsRadius : 0}
              isHeading={cell.isHeading}
              isHermeneutic={cell.isHermeneutic}
              isMetadata={cell.isMetadata}
              isFigure={cell.isFigure}
              isTable={cell.isTable}
              type={cell.type}
              idx={i}
              debug={debug}
            />
          )
        })}
      </g>
      <g transform={`translate(${size/2}, ${size/2})`} onMouseOut={mouseOutHandler}>
        <rect fill="transparent" x={-size/2} y={-size/2} width={size} height={size} ></rect>
        {/*
          <animated.line style={{pointerEvents:'none'}} x1="0" y1="0" stroke="red" x2={size/2} y2={0}
            strokeOpacity={pointer.opacity.to(o => o)}
            transform={pointer.theta.to((t) => `rotate(${t})`)}
          />
        */}
        <animated.line style={{pointerEvents:'none'}} x1="0" y1="0" stroke="var(--secondary)" x2={radius} y2={0}
          strokeOpacity={pointer.opacity.to(o => o)}
          transform={pointer.idx.to((idx) => {
            // const t = parseInt(idx, 10)
            return `rotate(${scaleTheta.invert(idx) - 90})`
          })}
        />
      </g>
    </svg>
  )
}

export default ArticleFingerprint
