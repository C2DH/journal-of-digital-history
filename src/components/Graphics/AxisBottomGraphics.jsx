import React from 'react'
import { AxisBottom } from '@visx/axis';


class AxisBottomGraphics extends React.Component{
  shouldComponentUpdate(nextProps) {
    return this.props.windowDimensions !== nextProps.windowDimensions
  }

  render() {
    //
    // <TrendAxisBottomGraphics id={id}
    //   axisOffsetTop={trendHeight - 10}
    //   scale={scaleX}
    //   numTicks={isMobileWithTablet ? 4 : 8}
    // />
    const {
      scale,
      numTicks = 10, tickHeight = 5,
      axisOffsetTop = 0, axisOffsetLeft = 0,
      label = 'bottom axis',
      style = {
        lineHeight: 20,
      },
    } = this.props;
    console.info('AxisBottom', style.lineHeight)
    return (
      <AxisBottom
        top={axisOffsetTop}
        left={axisOffsetLeft}
        scale={scale}
        numTicks={numTicks}
        label={label}
      >
        {(axis) => {
          const tickRotate = 0;
          return (
            <g className="my-custom-bottom-axis">
              {axis.ticks.map((tick, i) => {
                const tickX = tick.to.x;
                return (
                  <g
                    key={`vx-tick-${tick.value}-${i}`}
                    className={'vx-axis-tick'}
                  >
                    <line x1={tickX} y1={0} x2={tickX} y2={tickHeight} stroke="var(--primary)"/>
                    <line x1={tickX} y1={style.lineHeight + tickHeight*2 } x2={tickX} y2={style.lineHeight + tickHeight*3} stroke="var(--primary)"/>

                    <text
                      transform={`translate(${tickX}, ${style.lineHeight + 5}) rotate(${tickRotate})`}
                      fontSize={style.fontSize}
                      textAnchor="middle"
                      fill={style.color}
                    >
                      {tick.formattedValue}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
        </AxisBottom>
      )
    }
  }

export default AxisBottomGraphics
