import React from 'react'
import { Axis } from '@visx/axis';


class AxisVerticalGraphics extends React.Component{
  shouldComponentUpdate(nextProps) {
    return this.props.windowDimensions !== nextProps.windowDimensions
  }

  render() {
    //
    // <TrendAxisVerticalGraphics id={id}
    //   axisOffsetTop={trendHeight - 10}
    //   scale={scaleX}
    //   numTicks={isMobileWithTablet ? 4 : 8}
    // />
    const {
      scale,
      numTicks = 10,
      // tickHeight = 5,
      axisOffsetTop = 0, axisOffsetLeft = 0,
      label = 'left axis',
      orientation = 'left',
      // style = {
      //   lineHeight: 20,
      // },
    } = this.props;
    return (
      <Axis
        top={axisOffsetTop}
        left={axisOffsetLeft}
        scale={scale}
        numTicks={numTicks}
        label={label}
        orientation={orientation}
      />
      )
    }
  }

export default AxisVerticalGraphics
