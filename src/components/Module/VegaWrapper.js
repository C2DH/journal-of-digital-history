import React, { lazy } from 'react'
import { useBoundingClientRect } from '../../hooks/graphics'

const TrendLine = lazy(() => import('./TrendLine'))
const StackGraph = lazy(() => import('./StackGraph'))

const AvailableComponents = {
  'TrendLine': TrendLine,
  'Stackgraph': StackGraph
}

const VegaWrapper = ({ metadata, className }) => {
  const [{ width, height, windowDimensions}, ref] = useBoundingClientRect()
  const VisualisationComponent = AvailableComponents[metadata.component]
  return (
    <div ref={ref} className="h-100 w-100">
      <div className={className} style={{ height, width, overflow: 'hidden'}}>
        {VisualisationComponent
          ? <VisualisationComponent
              encoding={metadata.spec.encoding}
              data={metadata.spec.data}
              width={width} height={height} windowDimensions={windowDimensions}
            />
          : <div>this is vega {width} x {height}</div>
        }
      </div>
    </div>
  )
}

export default VegaWrapper
