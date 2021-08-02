import React from 'react'
import { scalePow } from 'd3-scale'

const ArticleFingerprintCellGraphics = ({
  idx=-1, type='markdown', theta = 0, radius=50, offset=25,
  charsRadius=5,
  isHeading=false,
  isHermeneutic=false
}) => {
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  // if isHermeneutic, inWard, if is heading is 0
  const charsValue = isHermeneutic ? charsRadius * -1 : isHeading ? 0 : charsRadius
  //
  return (
    <g className={[
      isHeading ? 'is-heading' : '',
      isHermeneutic ? 'is-hl' : '',
      'type-' + type
    ].join(' ')}>
      <line
        x1={cosTheta * (radius)}
        y1={sinTheta * (radius)}
        x2={cosTheta * (radius + charsValue)}
        y2={sinTheta * (radius + charsValue)}
      />
      {isHeading
        ? (
          <>
          <text
            textAnchor="middle"
            x={cosTheta * (radius + offset + 6)}
            y={sinTheta * (radius + offset + 6)}
            style={{fontSize: 6}}
          >{idx}</text>
          <circle className="heading-placeholder"
            cx={cosTheta * radius} cy={sinTheta * radius}
            r={1}
          />
          </>
        ) : null
      }
      <circle
        cx={cosTheta * (radius + charsValue)} cy={sinTheta * (radius + charsValue)}
        r={isHeading ? charsRadius : 2.5}
      />

    </g>
  )
}

const ArticleFingerprint = ({
  stats={},
  cells=[],
  // max radius
  radius=100,
  // this space is needed for the text elements
  marginTop=20, marginLeft=20, marginRight=20, marginBottom=20
}) => {
  const angleD = (Math.PI * 2) / (cells.length + 1)
  const svgWidth = radius*2 + marginLeft + marginRight
  const svgHeight = radius*2 + marginTop + marginBottom
  // this is the scale function linked to the total numbers of characters in a cell.
  // th scaled value is a number comprised between -radius/4 and radius/4
  // according to the number of characters
  const scaleNumChars = scalePow()
      // linear, commented out
      // .exponent(1)
      // with powerscale, exponent 0.25
      .exponent(.25)
      .domain(stats?.extentChars || [0,1])
      .range([0, radius/2])
  if (cells.length===0) {
    return null
  }
  return (
    <svg className="ArticleFingerprint position-absolute" xmlns="http://www.w3.org/2000/svg" width={svgWidth} height={svgHeight}>
      <g transform={`translate(${svgWidth/2}, ${svgHeight/2})`}>
        {/* outer circle (narrative layer)
        <circle cx={0} cy={0} stroke="var(--gray-200)" fill="transparent" r={radius}/>
        */}
        {/* inner circle (hermeneutics layer)
        <circle cx={0} cy={0} stroke="var(--gray-200)" fill="transparent" r={radius/2}/>
        */}
        {/* middle circle */}
        <circle cx={0} cy={0} stroke="var(--gray-400)" fill="transparent" r={radius/2 + radius/4}/>
        {cells.map((cell, i) => {
          const theta = (i) * angleD - Math.PI/2
          const charsRadius = scaleNumChars(cell.countChars)
          return (
            <ArticleFingerprintCellGraphics key={i} theta={theta}
              radius={radius/2 + radius/4}
              offset={radius/4}
              isHeading={cell.isHeading}
              isHermeneutic={cell.isHermeneutic}
              isMetadata={cell.isMetadata}
              charsRadius={charsRadius}
              type={cell.type}
              idx={i}
            />
          )
        })}
      </g>
    </svg>
  )
}

export default ArticleFingerprint
