import React from 'react'
import { scalePow,  } from 'd3-scale'
import { extent  } from 'd3-array'
import ArticleFingerprintCellGraphics from './ArticleFingerprintCellGraphics'


const ArticleFingerprint = ({
  stats={},
  cells=[],
  // svg dimnsion. Radisu is calculated based on this.
  size=100,
  debug=false,
  // this space is needed for the text elements
  margin=20,
  //
  variant=''
}) => {
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
    </svg>
  )
}

export default ArticleFingerprint
