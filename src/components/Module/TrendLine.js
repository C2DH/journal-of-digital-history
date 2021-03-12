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
  steps=[],
  change
}) => {
  const { t } = useTranslation()
  let {
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
  const [visualVariables, setVisualVariables] = useState({
    yExponent: 0.5
  })
  const changeVisualVariable = (key, value) => {
    setVisualVariables({
      ...visualVariables,
      [key]: value,
    })
  }
  const svgHeight = height - 30
  const xRange = [50, width-50]
  const yRange = [svgHeight - 50, 50]
  const xValues = []
  const yValues = []
  const hValues = [] // values to highlight
  // console.info(values[0], xScale.range(xRange)(values[0].vx))
  values.forEach((d, i) => {
    if (typeof d.vh !== 'undefined') {
      hValues.push(i)
    }
    xValues.push(xScale.range(xRange)(d.vx))
    yValues.push(yScale.exponent(visualVariables.yExponent).range(yRange)(d.vy))
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

  return (
    <>
    <svg width={width} height={svgHeight} onMouseMove={handleMouseMove}>
      <AxisGraphics
        numTicks={Math.round(width / 100)}
        scale={xScale.range(xRange)}
        orientation="bottom"
        axisOffsetLeft={0}
        axisOffsetTop={svgHeight - 50}
        label="top"
        windowDimensions={windowDimensions}
      />
      <AxisGraphics
        axisOffsetLeft={50}
        axisOffsetTop={0}
        orientation="left"
        numTicks={Math.round(svgHeight / 100)}
        exponent={visualVariables.yExponent}
        scale={yScale.exponent(visualVariables.yExponent).range(yRange)}
        windowDimensions={windowDimensions}
      />
      <LinePath
        className="TrendLine_linepath"
        data={values}
        x={(d, i) => xValues[i]}
        y={(d, i) => yValues[i]}
        stroke="var(--gray-500)"
        strokeWidth={1}
        strokeDasharray={displayPoints ? [1,2] : [0,0]}
      />
      {hValues.map((i) => (
        <circle key={`h-${i}`}
          cx={xValues[i]}
          cy={yValues[i]}
          className={`TrendLine_circleFocused ${i === pointer.idx && 'active'}`}
          r="2"/>
      ))}
      {valuesFocusedIndices.map((i) => (
        <circle key={`focus-${i}`}
          cx={xValues[i]}
          cy={yValues[i]}
          className={`TrendLine_circleFocused ${i === pointer.idx && 'active'}`}
          r="8"/>
      ))}
      {displayPoints
        ? values.map((d, i) => <circle key={i}
            cx={xValues[i]}
            cy={yValues[i]}
            className={`TrendLine_circle ${i === pointer.idx && 'active'}`}
            r="3"/>
          )
        : pointer.d
          ? <circle
              cx={pointer.x}
              cy={pointer.y}
              className='TrendLine_point active'
              r="3"/>
          : null
      }
    </svg>
    <div className="TrendLine_yExponent pl-4">
      <input type="range" id="volume" name="volume"
         min="0.1" max="4" step=".05" value={visualVariables.yExponent}
      onChange={(e) => changeVisualVariable('yExponent', e.target.value)} />
      <span className="ml-1" dangerouslySetInnerHTML={{__html: t('numbers.yExponent', {n: visualVariables.yExponent})}} />


    </div>
    {pointer.d && (
      <>
        <Pointer x={pointer.xMouse} y={pointer.yMouse} horizontal={false} height={1} width={width} />
        <Pointer x={pointer.xMouse} y={pointer.yMouse} height={height} width={1}/>
        <div className="position-absolute TrendLine_pointer" style={{
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
    {hValues.map((i,j) => (
      <div className="position-absolute TrendLine_highlight rounded" key={i} style={{
        transform: `translate(${xValues[i]}px, ${yValues[i]}px)`,
      }}>
        <div className="position-absolute TrendLine_highlight_num">{j + 1}</div>
      </div>
    ))}
    {valuesFocusedIndices.map((i) => (
      <div className="position-absolute TrendLine_activeStep rounded" key={i} style={{
        top: 10,
        left: 10,
        transform: `translate(${xValues[i]}px, ${yValues[i]}px)`,
        pointerEvents: 'none',
      }} dangerouslySetInnerHTML={{__html: steps[activeStep].content}} />
    ))}
    </>
  )
}

export default TrendLine
