import React from 'react'

const ArticleFingerprintCellGraphics = ({
  type='markdown', theta = 0,
  // originRadius is the minimal distance from the center, where the lines start.
  originRadius=100,
  // offsetRadius is the Cell actual distance from the center, based on the desired Cell value.
  // its calclation is deegated to the parent component.
  offsetRadius=10,
  // text offset
  // offset=0,
  // radius of the the small circle representing the Cell
  circleRadius=2.5,
  // radius of the reference circle
  refsRadius=0,
  isHeading=false,
  isHermeneutic=false,
}) => {
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  // position in x,y of the center of the small circle representing the Cell
  const cx = cosTheta * (offsetRadius + originRadius)
  const cy = sinTheta * (offsetRadius + originRadius)
  // coordinates in x y of the origin
  const ox = cosTheta * originRadius
  const oy = sinTheta * originRadius
  return (
    <g className={[
      isHeading ? 'is-heading' : '',
      isHermeneutic ? 'is-hl' : '',
      'type-' + type
    ].join(' ')}>
      <line
        x1={ox}
        y1={oy}
        x2={cx}
        y2={cy}
      />
      <circle className="origin"
        cx={ox} cy={oy}
        r={1}
      />
      {isHeading ? <circle className="heading-placeholder"
        cx={ox} cy={oy}
        r={5}
      />: null}
      {refsRadius ?
        <circle className="refs"
          cx={cosTheta * (offsetRadius + originRadius + refsRadius + 5)}
          cy={sinTheta * (offsetRadius + originRadius + refsRadius + 5)}
          r={refsRadius}
        />
      :null}
      <circle
        cx={cx} cy={cy}
        r={circleRadius}
      />

    </g>
  )
}

export default ArticleFingerprintCellGraphics
