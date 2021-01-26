/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Inspired by Mike Bostock's Streamgraph & Lee Byron’s test data generator:
 * https://bl.ocks.org/mbostock/4060954
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from '@visx/shape'
import { scaleOrdinal } from 'd3-scale'
import { animated, useSpring } from 'react-spring'
import { useStackProps } from '../../logic/vega'
import { curveLinear } from '@visx/curve'
import AxisBottomGraphics from '../Graphics/AxisBottomGraphics'
import Pointer from '../Graphics/Pointer'
import { useBoundingClientRect } from '../../hooks/graphics'

const colorScale = scaleOrdinal(['red', 'magenta', 'cyan', '#036ecd', '#9ecadd', '#51666e'])


const Streamgraph = ({
  stackOffset = 'wiggle',
  animate = true, className, style, data=[], encoding={}, focus=[]
}) => {
  const { t } = useTranslation()
  const [{ width, height, windowDimensions }, ref] = useBoundingClientRect()
  const {
    // xMin, xMax, yMin, yMax,
    x, y0, y1,
    // yScale,
    xScale,
    keys, values
  } = useStackProps({ encoding, data, width, height, stackOffset })
  // console.info('Streamgraph rendering', values, xMin, xMax, yMin, yMax)
  // console.info('render Streamgraph', windowDimensions, width, height, xScale(new Date()))
  const [pointer, setPointer] = useState({
    x: null,
    y: null,
    d: null,
    xInverted: null,
    key: null
  })

  const handleMouseMove = (e) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    console.info('handleMouseMove: ', e.pageX - boundingRect.x, e.clientY)
    setPointer({
      ...pointer,
      x: e.clientX - boundingRect.x,
      y: e.clientY - boundingRect.y,
      xInverted: xScale.invert(e.clientX - boundingRect.x)
    })
  }
  const handleMouseEnter = (key) => {
    // console.info('handleMouseFuu!!!!!', key, pointer)
    setPointer({
      ...pointer,
      key,
    })
  }

  return (
    <div style={style} className={`${className} h-100 w-100`} ref={ref} onMouseMove={handleMouseMove}>
      {width > 0 && (
        <>
        <svg width={width} height={height}>
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
                const tweened = animate ? useSpring({ d: path(stack) }) : { d: path(stack) };
                const color = colorScale(stack.key);
                return (
                  <g className="Stack_layer" onMouseEnter={() => handleMouseEnter(stack.key)} key={`series-${stack.key}`}>
                    <animated.path d={tweened.d || ''} fill={color} />
                  </g>
                );
              })}
            </Stack>
            <AxisBottomGraphics
              scale={xScale}
              windowDimensions={windowDimensions}
            />
          </g>
        </svg>
        <Pointer {...pointer} height={height} width={1} availableWidth={width} availableHeight={height}>
          <div className="Stack_Pointer">
            <span className="py-1 px-2 rounded">
              {pointer.key} - {t('dates.precise', {
                date: pointer.xInverted
              })}</span>
          </div>
        </Pointer>
        </>
      )}
    </div>
  );
}

export default Streamgraph
