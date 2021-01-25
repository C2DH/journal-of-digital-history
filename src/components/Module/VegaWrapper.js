import React, { lazy } from 'react'
import { useBoundingClientRect } from '../../hooks/graphics'

const TrendLine = lazy(() => import('./TrendLine'))
const StackGraph = lazy(() => import('./StackGraph'))

const AvailableComponents = {
  'TrendLine': TrendLine,
  'Stackgraph': StackGraph
}

const VegaWrapper = ({ metadata, className, steps, stepProgress, activeStep, progress }) => {
  const [{ width, height, windowDimensions}, ref] = useBoundingClientRect()
  const VisualisationComponent = AvailableComponents[metadata.component]
  return (
    <div ref={ref} className="h-100 w-100">
      <div className={className} style={{ height, width, overflow: 'hidden'}}>
        <div className="position-absolute" style={{
          top: 0, left: 0, width: `${progress*100}%`,
          zIndex: 100,
          height: 2,
          background: 'var(--secondary)'
        }}>{activeStep}</div>
        {VisualisationComponent
          ? <VisualisationComponent
              encoding={metadata.spec.encoding}
              data={metadata.spec.data}
              steps={steps}
              activeStep={activeStep}
              stepProgress={stepProgress}
              width={width} height={height} windowDimensions={windowDimensions}
            />
          : <div>this is vega {width} x {height}</div>
        }
      </div>
    </div>
  )
}

export default VegaWrapper
