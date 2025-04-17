import React, { useEffect, useRef } from 'react'
import ToCStep from '../ToCStep'
import { useTranslation } from 'react-i18next'
import './ArticleToCSteps.css'
import { a, useSprings } from '@react-spring/web'
import { ChevronDown } from 'react-feather'
import { useArticleToCStore } from '../../store'

const BackgroundColorVisible = '#00000016'
const BackgroundColorInvisible = '#00000000'

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
}) => {
  const { t } = useTranslation()
  const manuallyExpandedSteps = useRef([])
  const expandedStepsRef = useRef([])

  const [props, api] = useSprings(steps.length, (i) => {
    const height = Math.min(steps[i].length, aboveTheFoldSteps) * stepHeight
    return {
      to: {
        backgroundColor: BackgroundColorInvisible,
        rotation: 0,
        height,
      },
      from: {
        backgroundColor: BackgroundColorInvisible,
        rotation: 0,
        height,
      },
    }
  })

  const onClickHandler = (e, { id, label, layer }) => {
    if (typeof onClick === 'function') {
      onClick(e, { id, label, layer })
    }
    // api.start((i) => {
    //   return {

    //     height: i === stepIdx ? stepHeight * steps[stepIdx].length : aboveTheFoldSteps * stepHeight,
    //   }
    // })
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
        backgroundColor: isVisible ? BackgroundColorVisible : BackgroundColorInvisible,
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
      return {
        backgroundColor: isVisible ? BackgroundColorVisible : BackgroundColorInvisible,
        rotation: isExpanded ? Math.PI : 0,
        height: isExpanded
          ? stepHeight * steps[i].length
          : Math.min(steps[i].length, aboveTheFoldSteps) * stepHeight,
      }
    })
  }

  useEffect(
    () =>
      useArticleToCStore.subscribe((state) => {
        const stepsToExpand = []
        // getStepIdx(state.visibleCellsIdx)
        if (state.visibleCellsIdx.length === 0) {
          console.debug('[ArticleToCSteps] visible cells reset.')
          // if there are no visible cells, then we should collapse all steps
          manuallyExpandedSteps.current = []
          expandSteps([])
          return
        }
        // check whether the first or last visible cell is in the step
        const firstVisibleCellIdx = state.visibleCellsIdx[0]
        const lastVisibleCellIdx = state.visibleCellsIdx[state.visibleCellsIdx.length - 1]

        for (let i = 0; i < steps.length; i++) {
          const firstStepCellIdx = steps[i][0].cell.idx
          const lastStepCellIdx = steps[i][steps[i].length - 1].cell.idx
          const isIntersecting =
            (firstVisibleCellIdx >= firstStepCellIdx && firstVisibleCellIdx <= lastStepCellIdx) ||
            (firstVisibleCellIdx <= firstStepCellIdx && lastVisibleCellIdx >= firstStepCellIdx)
          console.debug(
            '[ArticleToCSteps]',
            i,
            firstStepCellIdx,
            '->',
            lastStepCellIdx,
            ' WITH ',
            firstVisibleCellIdx,
            '->',
            lastVisibleCellIdx,
            isIntersecting,
          )
          if (isIntersecting) {
            stepsToExpand.push(i)
          }
        }
        console.debug('[ArticleToCSteps] visibleCellsIdx:', state.visibleCellsIdx, stepsToExpand)

        expandSteps(stepsToExpand)
      }),
    [selectedCellIdx],
  )

  return (
    <ol style={style} className={`ArticleToCSteps py-3 ${className}`}>
      {props.map(({ height, backgroundColor, rotation }, i) => {
        const nestedSteps = steps[i]
        return (
          <li key={i} className="mb-2">
            <a.ol
              className="ArticleToCSteps__nested"
              style={{
                height,
                backgroundColor,
                paddingLeft: 10,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
            >
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
    </ol>
  )
}

export default ArticleToCSteps
