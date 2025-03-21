import React, {useMemo, useEffect} from 'react'
// import { useQueryParam, StringParam } from 'use-query-params'
import ArticleCellAccordion from './ArticleCellAccordion'
import ArticleCellAccordionAnchors from './ArticleCellAccordionAnchors'
import ArticleCellWrapper from './ArticleCellWrapper'
import ArticleScrollama from './ArticleScrollama'
import {
  RoleHidden,
  LayerHermeneutics, LayerHermeneuticsStep,
  LayerNarrativeStep
  // LayerNarrative,  LayerNarrativeStep,
  // DisplayLayerHermeneutics,
  // DisplayLayerAll
} from '../../constants'
import { useArticleStore } from '../../store'


const truncate = (s, maxLength=32) => {
  if (typeof s !== 'string') {
    return null
  }
  if (s.length < maxLength ) {
    return s
  }
  //trim the string to the maximum length
  const ts = s.substr(0, maxLength).trim()
  // TODO trim recursively till a regex is fine
  return `${ts} ...`
}

const ArticleStream = ({
  memoid='', cells=[],
  stepLayers = [ LayerNarrativeStep ],
  shadowLayers = [LayerHermeneuticsStep, LayerHermeneutics],
  anchorPrefix='',
  onDataHrefClick
}) => {
  // const [layer] = useQueryParam('layer', StringParam)

  // let shadowLayers = []
  // if (!layer) {
  //   shadowLayers = [LayerHermeneuticsStep, LayerHermeneutics]
  // } else if(layer === DisplayLayerHermeneutics) {
  //   shadowLayers = [LayerNarrative, LayerNarrativeStep]
  // } else if(layer === DisplayLayerAll) {
  //   shadowLayers = []
  // }

  const setVisibleCell = useArticleStore(store => store.setVisibleCell)
  let numCell = 0
  let key = -1
  // rebuild cell index based on same Layer
  const chunks = useMemo(() => {
    const buffers = []
    let previousLayer = null
    let buffer = new Array()
    cells.forEach((cell,i) => {
      // skip hidden cells
      if (cell.role === RoleHidden || cell.hidden) {
        return
      }
      if (i > 0 && (cell.layer !== previousLayer || cell.isHeading)) {
        buffers.push([...buffer])
        buffer = []
      }
      buffer.push(i)
      previousLayer = '' + cell.layer
    })
    if (buffer.length) {
      buffers.push(buffer)
    }
    return buffers
  }, [memoid, shadowLayers])

  const handleCellClick = (e, idx) => {
    // only when the target attribute is 'data-href'
    const dataHref = e.target.getAttribute('data-href')
    onDataHrefClick({ dataHref, idx })

    const anchorHref = e.target.getAttribute('data-idx')
    if (anchorHref) {
      e.target.setAttribute('href', `#${anchorPrefix}${anchorHref}`)
    }
  }

  const visibilityChangeHandler = ({ idx, isIntersecting }) => {
    // console.info('@visibilityChangeHandler', idx, isIntersecting)
    setVisibleCell(idx, anchorPrefix, isIntersecting)
  }

  useEffect(() => {
    let timeoutId = null;
    const requestIntersectionObserverUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const event = new Event('refreshIntersectionObserver')
        window.dispatchEvent(event)
      }, 500);
    }
    window.addEventListener('resize', requestIntersectionObserverUpdate)
    window.addEventListener('scroll', requestIntersectionObserverUpdate)

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', requestIntersectionObserverUpdate)
      window.removeEventListener('scroll', requestIntersectionObserverUpdate)
    }
  }, [])

  console.info('ArticleStream rerendered')
  return (
    <section className="ArticleStream">
    {chunks.map((cellsIndices, i) => {
      const isShadow = shadowLayers.includes(cells[cellsIndices[0]].layer)
      const title = cells[cellsIndices[0]]?.heading?.content ?? ''
      const truncatedTitle = truncate(title)
      const isStep = stepLayers.includes(cells[cellsIndices[0]].layer)
      // eslint-disable-next-line
      // debugger
      if (isStep) {
        numCell += cellsIndices.length - 1
        return (
          <ArticleScrollama
            initialNumCell={numCell - cellsIndices.length + 1}
            key={i}
            cells={cellsIndices.map(i => cells[i])}
            onCellClick={handleCellClick}
            onVisibilityChange={visibilityChangeHandler}
          />
        )
      }
      if (isShadow) {
        return (
          <div key={i} className="pt-4">
          <ArticleCellAccordionAnchors
            anchorPrefix={anchorPrefix}
            cells={cells} cellsIndices={cellsIndices}/>
          <ArticleCellAccordion
            isCollapsed
            eventKey={cells[cellsIndices[0]].idx}
            size={cellsIndices.length}
            startNum={numCell + 1}
            endNum={numCell + cellsIndices.length}
            title={title}
            truncatedTitle={truncatedTitle}
            onVisibilityChange={visibilityChangeHandler}
          >
            {cellsIndices.map((j) => {
              key++
              const cell = cells[j]
              if (!cell.isFigure) {
                numCell += 1
              }
              return (
                <React.Fragment key={j}>
                <a className='ArticleStream_anchor anchor' id={`${anchorPrefix}${cell.idx}`}></a>
                <ArticleCellWrapper key={key}
                  onClick={(e) => handleCellClick(e, cell.idx)}
                  numCell={numCell}
                  memoid={memoid}
                  cell={cell}
                  onVisibilityChange={visibilityChangeHandler}
                />
                </React.Fragment>
              )
            })}
          </ArticleCellAccordion>
          </div>
        )
      }
      return (
        <React.Fragment key={i}>
        {cellsIndices.map((j) => {
          key++
          const cell = cells[j]
          if (!cell.isFigure) {
            numCell += 1
          }
          return (
            <React.Fragment key={j}>
            <a className='ArticleStream_anchor anchor' id={`${anchorPrefix}${cell.idx}`}></a>
            <ArticleCellWrapper key={key}
              onClick={(e) => handleCellClick(e, cell.idx)}
              numCell={numCell}
              memoid={memoid}
              cell={cell}
              onVisibilityChange={visibilityChangeHandler}
            />
            </React.Fragment>
          )
        })}
        </React.Fragment>
      )

    })}
    </section>
  )
}

export default React.memo(ArticleStream, (prevProps, nextProps) => {
  if (prevProps.memoid === nextProps.memoid) {
    return true // props are equal
  }
  return false // props are not equal -> update the component
})
