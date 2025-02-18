import React, { lazy, useMemo } from 'react'
import { useBoundingClientRect } from '../../hooks/graphics'
import { getParsedSteps } from '../../logic/ipynb'
import { getNarrativeProgress } from '../../logic/narrative'

const TrendLine = lazy(() => import('./TrendLine'))
const StackGraph = lazy(() => import('./StackGraph'))

const AvailableComponents = {
  'TrendLine': TrendLine,
  'Stackgraph': StackGraph
}

const VegaWrapper = ({ metadata, className, progress, children }) => {
  const [{ width, height, windowDimensions}, ref] = useBoundingClientRect()
  // narrative part, if any
  const steps = useMemo(() => getParsedSteps({ steps: metadata.steps || [] }), [metadata])
  const { stepProgress, activeStep } = getNarrativeProgress({ steps, progress })

  const VisualisationComponent = AvailableComponents[metadata.component]
  return (
    <div ref={ref} className="h-100 w-100">
      <div className={className} style={{ height, width, overflow: 'hidden'}}>
        <div className="position-absolute" style={{
          top: 0, left: 0, width: `${progress*100}%`,
          zIndex: 100,
          height: 2,
          background: 'var(--secondary)'
        }}></div>
        {VisualisationComponent
          ? <VisualisationComponent
              encoding={metadata.spec.encoding}
              displayPoints={false}
              data={metadata.spec.data}
              steps={steps}
              activeStep={activeStep}
              stepProgress={stepProgress}
              progress={progress}
              width={width} height={height} windowDimensions={windowDimensions}
            />
          : <div>this is vega {width} x {height}</div>
        }

      </div>
      { children }
    </div>
  )
}

export default VegaWrapper
