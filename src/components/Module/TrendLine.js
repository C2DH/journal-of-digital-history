import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LinePath } from '@visx/shape'
import AxisGraphics from '../Graphics/AxisGraphics'
import { useVegaliteProps, getClosestDatumIdxFromXY } from '../../logic/vega'
import Pointer from '../Graphics/Pointer'



const TrendLine = ({
  width, height, windowDimensions, encoding={}, data=[],
  displayLine=false,
  displayPoints=true,
  activeStep=-1,
  steps=[]
}) => {
  const { t } = useTranslation()
  const {
    // xMin, xMax, yMin, yMax,
    // x, y0, y1,
    yScale,
    xScale,
    values,
  } = useVegaliteProps({ encoding, data, width, height })
  const [pointer, setPointer] = useState({
    x: null,
    y: null,
    d: null,
    idx: -1,
  })
  const xRange = [50, width-50]
  const yRange = [height - 50, 50]
  const xValues = []
  const yValues = []
  values.forEach((d) => {
    xValues.push(xScale.range(xRange)(d.vx))
    yValues.push(yScale.range(yRange)(d.vy))
  })
  const handleMouseMove = (e) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const xMouse = e.clientX - boundingRect.x
    const yMouse = e.clientY - boundingRect.y
    // calculate closest datum
    const closestIdx = getClosestDatumIdxFromXY({
      x: xMouse,
      y: yMouse,
      xValues,
      yValues
    })
    setPointer({
      ...pointer,
      d: values[closestIdx],
      x: xValues[closestIdx],
      y: yValues[closestIdx],
      xMouse,
      yMouse,
      idx: closestIdx,
    })
  }

  if (width === 0) {
    return null
  }

  let valuesFocusedIndices = []
  if (Array.isArray(steps[activeStep]?.focus)) {
    valuesFocusedIndices = values.reduce((acc, d, i) => {
      if (steps[activeStep].focus.includes(i)) {
        acc.push(i)
      }
      return acc
    }, [])
  }

  console.info('activeStep', activeStep, valuesFocusedIndices)

  return (
    <>
    <svg width={width} height={height} onMouseMove={handleMouseMove}>
      <AxisGraphics
        numTicks={Math.round(width / 100)}
        scale={xScale.range(xRange)}
        orientation="bottom"
        axisOffsetLeft={0}
        axisOffsetTop={height-50}
        label="top"
        windowDimensions={windowDimensions}
      />
      <AxisGraphics
        axisOffsetLeft={50}
        axisOffsetTop={0}
        orientation="left"
        numTicks={Math.round(height / 100)}
        scale={yScale.range(yRange)}
        windowDimensions={windowDimensions}
      />
      <LinePath
        className="TrendLine_linepath"
        data={values}
        x={(d, i) => xValues[i]}
        y={(d, i) => yValues[i]}
        stroke="#222"
        strokeWidth={1.5}
        strokeDasharray={[1,2]}
      />
      {valuesFocusedIndices.map((i) => (
        <circle key={`focus-${i}`}
          cx={xValues[i]}
          cy={yValues[i]}
          className={`TrendLine_circleFocused ${i === pointer.idx && 'active'}`}
          r="8"/>
      ))}
      {values.map((d, i) => (
        <circle key={i}
          cx={xValues[i]}
          cy={yValues[i]}
          className={`TrendLine_circle ${i === pointer.idx && 'active'}`}
          r="3"/>
      ))}
    </svg>
    {pointer.d && (
      <>
        <Pointer x={pointer.xMouse} y={pointer.yMouse} horizontal={false} height={1} width={width} />
        <Pointer x={pointer.xMouse} y={pointer.yMouse} height={height} width={1}/>
        <div className="position-absolute" style={{
          top: 10,
          left: 10,
          transform: `translate(${pointer.x}px, ${pointer.y}px)`,
          pointerEvents: 'none'
        }}>
          <small className="text-white bg-secondary px-2 py-1 rounded text-small" style={{
            fontSize: 'var(--font)'
          }}>
            {pointer.d.vy} - {t('dates.precise', {
              date: new Date(pointer.d.vx)
            })}
          </small>
        </div>
      </>
    )}
    </>
  )
}

export default TrendLine
