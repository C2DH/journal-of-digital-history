import React, { useEffect, useRef } from 'react'
import ToCStep from '../ToCStep'
import { useTranslation } from 'react-i18next'
import './ArticleToCSteps.css'
import { a, useSprings } from '@react-spring/web'
import { ChevronDown } from 'react-feather'
import { useToCStore } from './store'

const ArticleToCSteps = ({
  aboveTheFoldSteps = 2,
  selectedCellIdx = -1,
  stepHeight = 20,
  steps = [],
  width = 100,
  marginEnd = 50,
  style,
  className = '',
  onClick,
  children,
}) => {
  const { t } = useTranslation()
  const manuallyExpandedSteps = useRef([])
  const expandedStepsRef = useRef([])
  const latestVisibleCellIdx = useRef(-1)

  const [props, api] = useSprings(steps.length, (i) => {
    const height = Math.min(steps[i].length, aboveTheFoldSteps) * stepHeight
    return {
      to: {
        // backgroundColor: BackgroundColorInvisible,
        rotation: 0,
        height,
        progressHeight: 0,
      },
      from: {
        // backgroundColor: BackgroundColorInvisible,
        rotation: 0,
        height,
        progressHeight: 0,
      },
    }
  })

  const onClickHandler = (e, { id, label, layer }) => {
    if (typeof onClick === 'function') {
      onClick(e, { id, label, layer })
    }
  }

  const manuallyToggleStep = (stepIdx) => {
    // toggle expanded step
    if (manuallyExpandedSteps.current.includes(stepIdx)) {
      manuallyExpandedSteps.current = manuallyExpandedSteps.current.filter((d) => d !== stepIdx)
    } else {
      manuallyExpandedSteps.current.push(stepIdx)
    }
    console.debug('[ArticleToCSteps] manuallyToggleStep', stepIdx, manuallyExpandedSteps.current)

    api.start((i) => {
      // check if the step (section) is in the list of steps to expand (or to become visible)
      const isVisible = expandedStepsRef.current.includes(i)
      const shouldItExpand = steps[i].length > aboveTheFoldSteps
      const isExpanded = (isVisible && shouldItExpand) || manuallyExpandedSteps.current.includes(i)

      return {
        // backgroundColor: isVisible ? BackgroundColorVisible : BackgroundColorInvisible,
        rotation: isExpanded ? Math.PI : 0,
        height: isExpanded
          ? stepHeight * steps[i].length
          : Math.min(steps[i].length, aboveTheFoldSteps) * stepHeight,
      }
    })
  }

  const expandSteps = (stepIdxs) => {
    expandedStepsRef.current = stepIdxs
    console.debug('[ArticleToCSteps] expandSteps', stepIdxs, expandedStepsRef.current)
    if (!steps.length) {
      return
    }
    api.start((i) => {
      // check if the step (section) is in the list of steps to expand (or to become visible)
      const isVisible = stepIdxs.includes(i)
      const shouldItExpand = steps[i].length > aboveTheFoldSteps
      const isExpanded = (isVisible && shouldItExpand) || manuallyExpandedSteps.current.includes(i)
      // const firstStepCellIdx = steps[i][0].cell.idx
      const lastStepCellIdx = steps[i][steps[i].length - 1].cell.idx
      let progressHeight = 0

      if (!isExpanded && lastStepCellIdx < latestVisibleCellIdx.current) {
        progressHeight = Math.min(steps[i].length, aboveTheFoldSteps) * stepHeight
      } else if (isExpanded && lastStepCellIdx < latestVisibleCellIdx.current) {
        progressHeight = (steps[i].length - 1) * stepHeight
      } else if (isExpanded && lastStepCellIdx >= latestVisibleCellIdx.current) {
        progressHeight =
          steps[i].filter((d) => d.cell.idx <= latestVisibleCellIdx.current).length * stepHeight - 1
      }

      return {
        rotation: isExpanded ? Math.PI : 0,
        height: isExpanded
          ? stepHeight * steps[i].length
          : Math.min(steps[i].length, aboveTheFoldSteps) * stepHeight,
        progressHeight,
      }
    })
  }
  useEffect(() => {
    return useToCStore.subscribe((state) => {
      if (state.visibleCellsIdx.length === 0) {
        console.debug('[ArticleToCSteps] visible cells reset.')
        // if there are no visible cells, then we should collapse all steps
        manuallyExpandedSteps.current = []
        expandSteps([])
        return
      }
      if (latestVisibleCellIdx.current !== state.latestVisibleCellIdx) {
        console.debug('[ArticleToCSteps] latestVisibleCellIdx cells:', state.latestVisibleCellIdx)
        latestVisibleCellIdx.current = state.latestVisibleCellIdx
        for (let i = 0; i < steps.length; i++) {
          const firstStepCellIdx = steps[i][0].cell.idx
          const lastStepCellIdx = steps[i][steps[i].length - 1].cell.idx
          const isIntersecting =
            latestVisibleCellIdx.current >= firstStepCellIdx &&
            latestVisibleCellIdx.current <= lastStepCellIdx

          if (isIntersecting) {
            manuallyExpandedSteps.current = []
            expandSteps([i])
            break
          }
        }
      }
    })
  }, [selectedCellIdx])

  return (
    <ol style={style} className={`ArticleToCSteps py-3 ${className}`}>
      {props.map(({ height, rotation, progressHeight }, i) => {
        const nestedSteps = steps[i]
        return (
          <li key={i} className="mb-2">
            <a.ol
              className="ArticleToCSteps__nested"
              style={{
                height,
                position: 'relative',
                paddingLeft: 10,
              }}
            >
              <a.div
                style={{ height: progressHeight }}
                className="ArticleToCSteps__nested__progress"
              />
              {nestedSteps.map((step, j) => {
                const label = step.cell.isHeading
                  ? step.cell.heading.content
                  : step.cell.isFigure
                  ? t(step.cell.figure.tNLabel, { n: step.cell.figure.tNum })
                  : '(na)'
                return (
                  <li key={j}>
                    <ToCStep
                      marginEnd={marginEnd}
                      figureRefPrefix={step.cell.figure?.refPrefix}
                      width={width - 10}
                      active={selectedCellIdx === step.cell.idx}
                      isFigure={!!step.cell.figure}
                      isHermeneutics={step.cell.isHermeneutics}
                      layer={step.cell.layer}
                      isSectionEnd={step.isSectionEnd}
                      isSectionStart={step.isSectionStart}
                      level={step.cell.level}
                      id={step.cell.idx}
                      label={label}
                      onClick={(e, payload) => onClickHandler(e, payload, i)}
                    />
                  </li>
                )
              })}
            </a.ol>
            {nestedSteps.length > aboveTheFoldSteps ? (
              <div className="ArticleToCSteps__nested__toggleCollapsed" style={{ width }}>
                <button style={{ right: marginEnd / 2 - 4 }} onClick={() => manuallyToggleStep(i)}>
                  <a.span
                    style={{
                      transform: rotation.to((v) => `rotate(${v}rad)`),
                    }}
                  >
                    <ChevronDown size={10} />
                  </a.span>
                </button>
              </div>
            ) : null}
          </li>
        )
      })}
      {children}
    </ol>
  )
}

export default ArticleToCSteps
