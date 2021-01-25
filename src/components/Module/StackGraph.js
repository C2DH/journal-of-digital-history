import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from '@visx/shape'
import AxisGraphics from '../Graphics/AxisGraphics'
import { scaleOrdinal } from 'd3-scale'
import { curveLinear } from '@visx/curve'
import { animated } from 'react-spring'
import { useStackProps, getClosestDatumIdxFromX } from '../../logic/vega'
import Pointer from '../Graphics/Pointer'

const colorScale = scaleOrdinal(['red', 'magenta', 'cyan', '#036ecd', '#9ecadd', '#51666e'])


const StackGraph = ({
  width, height, windowDimensions,
  encoding={}, data=[],
  stackOffset='diverged'
}) => {
  const { t } = useTranslation()
  const {
    // xMin, xMax, yMin, yMax,
    // x,
    // y0, y1,
    yScale,
    xScale,
    keys, values
  } = useStackProps({ encoding, data, width, height, stackOffset })
  const [pointer, setPointer] = useState({
    x: null,
    y: null,
    d: null,
    key: null,
    idx: -1,
  })
  const xRange = [50, width-50]
  const yRange = [height - 50, 50]
  const x = (d) => xScale.range(xRange)(d.data.x)
  const y0 = (d,i) => yScale.range(yRange)(d[0]) ?? 0
  const y1 = (d) => yScale.range(yRange)(d[1]) ?? 0
  const xValues = []
  values.forEach((d) => {
    xValues.push(xScale.range(xRange)(d.x))
  })

  const handleMouseMove = (e) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const xMouse = e.clientX - boundingRect.x
    const yMouse = e.clientY - boundingRect.y
    console.info('handleMouseMove', xMouse, yMouse, values)
    const closestIdx = getClosestDatumIdxFromX({
      x: xMouse,
      xValues,
    })

    setPointer({
      ...pointer,
      d: values[closestIdx],
      x: xValues[closestIdx],
      // y: yValues[closestIdx],
      xMouse,
      yMouse,
      // idx: closestIdx,
    })
  }
  const handleMouseEnter = (key) => {
    console.info('handleMouseEnter', key)
    setPointer({
      ...pointer, key
    })
  }

  if (width === 0) {
    return null
  }

  return (
    <>
    <svg width={width} height={height} onMouseMove={handleMouseMove}>
    <g>
      <Stack offset={stackOffset} data={values}
        color={colorScale}
        keys={keys}
        x={x}
        y0={y0}
        y1={y1}
        curve={curveLinear}
        order="ascending"
      >
        {({ stacks, path }) => stacks.map(stack => {
          // Alternatively use renderprops <Spring to={{ d }}>{tweened => ...}</Spring>
          const tweened = { d: path(stack) };
          const color = colorScale(stack.key);
          return (
            <g className="StackGraph_layer" onMouseEnter={() => handleMouseEnter(stack.key)} key={`series-${stack.key}`}>
              <animated.path d={tweened.d || ''} fill={color} />
            </g>
          );
        })}
      </Stack>
    </g>
    <AxisGraphics
      numTicks={Math.round(width / 100)}
      scale={xScale.range(xRange)}
      orientation="bottom"
      axisOffsetLeft={0}
      axisOffsetTop={height-50}
      label="top"
      windowDimensions={windowDimensions}
    />
    </svg>
    {!!pointer.d && (
      <>
        <Pointer x={pointer.xMouse} y={pointer.yMouse} horizontal height={height} width={1}/>
        <div className="position-absolute" style={{
          top: 10,
          left: 10,
          transform: `translate(${pointer.x}px, ${pointer.yMouse}px)`,
          pointerEvents: 'none'
        }}>
          <small className="text-white bg-secondary px-2 py-1 rounded text-small" style={{
            fontSize: 'var(--font)'
          }}>
            {pointer.key} <b>{pointer.d[pointer.key]}</b>
            - {t('dates.precise', {
              date: pointer.d.x.toDate()
            })}
          </small>
        </div>
      </>
    )}
    </>
  )
}

export default StackGraph
